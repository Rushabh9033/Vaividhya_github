from fastapi import APIRouter, HTTPException
from database import admins_collection, registrations_collection, events_collection 
from models.admin import AdminLogin
from passlib.context import CryptContext
from bson import ObjectId

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "sha256_crypt"], deprecated="auto")

router = APIRouter()

# Create admin manually once
@router.post("/admin/create")
async def create_admin(data: AdminLogin):
    data.password = pwd_context.hash(data.password)
    await admins_collection.insert_one(data.dict())
    return {"message": "Admin created"}

# Hardcoded Credentials as per User Request (Step 3328)
ADMIN_CREDENTIALS = {
    "TEAM1": "92jAzvoC",
    "TEAM2": "Y9HwuSLm",
    "TEAM3": "ULBU1CU8",
    "TEAM4": "pm6srCqx",
    "TEAM5": "N5tX5QxB",
    "TEAM6": "egR2W5aP",
    "TEAM7": "EM9sEonA",
    "TEAM8": "J4ylrPI2",
    "TEAM9": "yyNd0U5j",
    "TEAM10": "ar7YBxY7"
}

@router.post("/admin/login")
async def admin_login(data: AdminLogin):
    # Direct Key Check
    username = data.username.upper() # Handle lowercase input
    
    if username in ADMIN_CREDENTIALS:
        if ADMIN_CREDENTIALS[username] == data.password:
            return {"message": "Login success", "username": username}
            
    # Fallback to DB check ONLY if not found in hardcode (Optional, or just fail)
    # User said "add in code not in database", so we trust code.
    raise HTTPException(401, "Invalid credentials")

@router.get("/admin/registrations")
async def all_registrations():
    regs = []
    async for r in registrations_collection.find():
        r["_id"] = str(r["_id"])
        regs.append(r)
    return regs

@router.delete("/admin/registrations/{id}")
async def delete_registration(id: str):
    await registrations_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}

@router.get("/admin")
def admin_check():
    return {"message": "Admin route working"}

@router.get("/admin/event-stats")
async def event_stats():
    pipeline = [
        {"$unwind": "$selected_events"},
        {"$group": {"_id": "$selected_events", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    # to_list requires length, using 1000 to cover all possible events
    stats = await registrations_collection.aggregate(pipeline).to_list(length=1000)
    return stats

@router.get("/admin/event-level-registrations")
async def event_level_registrations():
    # 1. Fetch all events to get names and prices
    events_list = await events_collection.find({}, {"_id": 0}).to_list(100)
    event_map = {e.get("event_id") or e.get("slug"): e for e in events_list}

    # 2. Fetch all registrations
    regs = await registrations_collection.find().to_list(3000)

    # 3. Flatten the data
    flattened = []
    for r in regs:
        # Base user information
        user_info = {
            "reg_id": str(r["_id"]),
            "full_name": r.get("full_name", "N/A"),
            "enrollment_no": r.get("enrollment_no", "N/A"),
            "email": r.get("email", "N/A"),
            "phone": r.get("phone", "N/A"),
            "college": r.get("college", "N/A"),
            "department": r.get("department", "N/A"),
            "year": r.get("year", "N/A"),
            "payment_status": r.get("payment_status", "PENDING"),
            "approved_by": r.get("approved_by"),
            "approved_at": r.get("approved_at"),
            "register_date": r.get("register_date"),
            "register_time": r.get("register_time")
        }

        # Check for events in 'selected_events' (list of slugs) 
        # or 'event_details' (list of objects)
        ev_list = r.get("selected_events", [])
        details = r.get("event_details", [])

        # Priority on 'event_details' if it exists and has content
        if details and isinstance(details, list):
            for detail in details:
                ev_info = user_info.copy()
                ev_info.update({
                    "event_id": detail.get("event_id") or detail.get("event_name"),
                    "event_name": detail.get("event_name"),
                    "event_category": detail.get("category") or "N/A",
                    "price": detail.get("price", 0)
                })
                flattened.append(ev_info)
        
        # fallback to 'selected_events' slugs if details was empty
        elif ev_list and isinstance(ev_list, list):
            for slug in ev_list:
                ev_data = event_map.get(slug, {})
                ev_info = user_info.copy()
                ev_info.update({
                    "event_id": slug,
                    "event_name": ev_data.get("event_name") or ev_data.get("name") or slug,
                    "event_category": ev_data.get("category", "N/A"),
                    "price": ev_data.get("price") or ev_data.get("fee") or 0
                })
                flattened.append(ev_info)
    
    # 4. Sort by approved_at DESC (Newest approvals first)
    # We use a custom key to handle None/missing values safely
    flattened.sort(key=lambda x: str(x.get("approved_at") or ""), reverse=True)
    
    return flattened
