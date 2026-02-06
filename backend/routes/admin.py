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

@router.post("/admin/login")
async def admin_login(data: AdminLogin):
    # Find admin by username (case-insensitive ideally, but exact for now)
    admin = await admins_collection.find_one({"username": data.username})
    
    if not admin:
        raise HTTPException(401, "Invalid username")
        
    if not pwd_context.verify(data.password, admin["password"]):
        raise HTTPException(401, "Invalid password")
        
    return {"message": "Login success", "username": admin["username"]}

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
