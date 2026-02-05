from fastapi import APIRouter, HTTPException, Body
from database import registrations_collection
from models.registration import Registration
from bson import ObjectId
from utils import generate_receipt
from datetime import datetime

router = APIRouter()

@router.post("/")
async def register_user(data: Registration):
    # Check for existing email
    if await registrations_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check for existing enrollment
    if await registrations_collection.find_one({"enrollment_no": data.enrollment_no}):
        raise HTTPException(status_code=400, detail="Enrollment number already registered")

    # Prepare document
    doc = data.dict()
    doc["created_at"] = datetime.utcnow()
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
        reg["event_details"] = events_list
        
        # Calculate Total with Discount Logic
        # Rule: 3 Events of ₹50 = ₹120 (Save ₹30)
        price_50_count = sum(1 for e in events_list if e.get("price", 0) == 50)
        other_prices_sum = sum(e.get("price", 0) for e in events_list if e.get("price", 0) != 50)
        
        sets_of_3 = price_50_count // 3
        remainder_50 = price_50_count % 3
        
        discounted_50_total = (sets_of_3 * 120) + (remainder_50 * 50)
        
        reg["total_amount"] = other_prices_sum + discounted_50_total
    else:
        reg["event_details"] = []
        reg["total_amount"] = 0
        
    return reg

@router.put("/{id}/events")
async def update_events(id: str, events: list[str] = Body(..., embed=True)):
    await registrations_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"selected_events": events}}
    )
    return {"message": "Events updated"}

@router.patch("/{id}/mark-paid")
async def mark_paid(id: str, data: dict = Body(...)):
    # Data should contain admin_name or admin_dept
    update_data = {
        "payment_status": "PAID",
        "approved_by": data.get("admin_name", "Unknown"),
        "approved_dept": data.get("admin_dept", "Unknown"),
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
            "approved_dept": None,
            "approved_at": None
        }}
    )
    return {"message": "Marked as unpaid"}
