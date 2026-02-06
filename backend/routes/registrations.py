from fastapi import APIRouter, HTTPException, Body
from database import registrations_collection
from models.registration import Registration
from bson import ObjectId
from utils import generate_receipt
from datetime import datetime

router = APIRouter()

@router.post("/")
async def register_user(data: Registration):
    # Normalize inputs (Case Insensitive)
    data.email = data.email.lower()
    data.enrollment_no = data.enrollment_no.lower()

    # CAPACITY CHECK (Removed)


    # Check for existing email
    if await registrations_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check for existing enrollment
    if await registrations_collection.find_one({"enrollment_no": data.enrollment_no}):
        raise HTTPException(status_code=400, detail="Enrollment number already registered")

    # Prepare document
    now = datetime.utcnow()
    doc = data.dict()
    doc["created_at"] = now
    doc["register_date"] = now.strftime("%Y-%m-%d")
    doc["register_time"] = now.strftime("%H:%M:%S")
    doc["payment_status"] = "PENDING"
    doc["selected_events"] = [] # Initialize empty
    doc["total_amount"] = 0
    # doc["receipt_no"] = generate_receipt() # Optional, if we want persistent receipt numbers

    result = await registrations_collection.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Registered successfully"}

@router.get("/{id}")
async def get_registration(id: str):
    reg = await registrations_collection.find_one({"_id": ObjectId(id)})
    if not reg:
        raise HTTPException(404, "Not found")
    reg["_id"] = str(reg["_id"])

    # Manual aggregation: Fetch event details for the selected IDs
    if "selected_events" in reg and reg["selected_events"]:
        from database import events_collection
        event_slugs = reg["selected_events"]
        
        events_cursor = events_collection.find({"event_id": {"$in": event_slugs}})
        events_list = []
        async for e in events_cursor:
            e["_id"] = str(e["_id"])
            events_list.append(e)
        
        reg["event_details"] = events_list
        total = sum(e.get("price", 0) for e in events_list)
        if len(events_list) >= 3:
            total -= 30
        reg["total_amount"] = total
    else:
        reg["event_details"] = []
        reg["total_amount"] = 0
        
    return reg

@router.put("/{id}/events")
async def update_events(id: str, events: list[str] = Body(..., embed=True)):
    # Check Capacity before Updating
    if events:
        pipeline = [
            {"$unwind": "$selected_events"},
            {"$match": {"selected_events": {"$in": events}}},
            {"$group": {"_id": "$selected_events", "count": {"$sum": 1}}},
            {"$match": {"count": {"$gte": 50}}}
        ]
        full_found = await registrations_collection.aggregate(pipeline).to_list(None)
        if full_found:
             full_ids = [f["_id"] for f in full_found]
             raise HTTPException(status_code=400, detail=f"Slots Full for: {', '.join(full_ids)}")

    # 1. Calculate New Total Amount
    from database import events_collection
    
    # Fetch price/fee for selected events
    # Use $in query to get all event docs
    events_metrics = await events_collection.find({"event_id": {"$in": events}}).to_list(length=100)
    
    total = 0
    for e in events_metrics:
        # Handle both 'price' and 'fee' keys safely
        total += e.get("price", e.get("fee", 0))
        
    # Discount Logic
    if len(events) >= 3:
        total -= 30
        if total < 0: total = 0

    # 2. Update DB AND Reset Payment Status (Security Fix)
    await registrations_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "selected_events": events,
            "total_amount": total,
            "payment_status": "PENDING", # Force Reset
            "approved_by": None,
            "approved_at": None,
            "approved_team": None
        }}
    )
    return {"message": "Events updated, Amount recalculated. Payment status reset to PENDING."}

@router.patch("/{id}/mark-paid")
async def mark_paid(id: str, data: dict = Body(...)):
    # Data should contain admin_name or admin_dept
    update_data = {
        "payment_status": "PAID",
        "approved_by": data.get("admin_name", "Unknown"),
        "approved_at": datetime.utcnow()
    }
    
    await registrations_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )
    return {"message": "Marked as paid"}

@router.patch("/{id}/mark-unpaid")
async def mark_unpaid(id: str):
    await registrations_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "payment_status": "PENDING",
            "approved_by": None,
            "approved_at": None
        }}
    )
    return {"message": "Marked as unpaid"}
