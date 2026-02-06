from fastapi import APIRouter, HTTPException
from database import admins_collection, registrations_collection 
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
    # 1. Get Counts from Registrations
    pipeline = [
        {"$unwind": "$selected_events"},
        {"$group": {"_id": "$selected_events", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    existing_stats = await registrations_collection.aggregate(pipeline).to_list(length=1000)
    stats_map = {item["_id"]: item["count"] for item in existing_stats}
    
    # 2. Get All Event Names from Events Collection
    from database import events_collection, db
    stats_collection = db.events_stats # PHYSICAL COLLECTION
    
    all_events_cursor = events_collection.find({})
    final_stats = []
    processed_slugs = set()
    
    async for event in all_events_cursor:
        slug = event["event_id"]
        name = event["event_name"]

        if "total" in slug.lower():
            continue

        count = stats_map.get(slug, 0)
        
        stat_item = {
            "event_id": slug,
            "event_name": name, 
            "count": count
        }
        final_stats.append(stat_item)
        processed_slugs.add(slug)
        
        # ✅ PHYSICAL SYNC: Update or Insert into events_stats collection
        await stats_collection.update_one(
            {"event_id": slug},
            {"$set": stat_item},
            upsert=True
        )
        
    # 3. Handle ghost events
    for slug, count in stats_map.items():
        if slug not in processed_slugs:
            if "total" in str(slug).lower():
                continue

            stat_item = {
                "event_id": slug,
                "event_name": str(slug).replace("-", " ").title() + " (Unknown)",
                "count": count
            }
            final_stats.append(stat_item)
            # ✅ PHYSICAL SYNC
            await stats_collection.update_one(
                {"event_id": slug},
                {"$set": stat_item},
                upsert=True
            )

    final_stats.sort(key=lambda x: x["count"], reverse=True)
    return final_stats
