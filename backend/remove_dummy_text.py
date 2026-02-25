import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import re

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def clean_dummy_data():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- CLEANING DUMMY DATA FOR BRIDGE BATTLE ---")
    
    # Check for names containing "(Dummy)"
    regex = re.compile(r"\(Dummy\)", re.IGNORECASE)
    
    # 1. Update Registrations
    cursor = db.registrations.find({"full_name": regex, "selected_events": "bridge-battle"})
    users = await cursor.to_list(None)
    
    print(f"Found {len(users)} registrations to clean.")
    
    for user in users:
        old_name = user.get("full_name", "")
        new_name = old_name.replace(" (Dummy)", "").replace("(Dummy)", "").strip()
        
        old_email = user.get("email", "")
        new_email = old_email.replace("@dummy.com", "@gmail.com")
        
        print(f"Cleaning: {old_name} -> {new_name} | {old_email} -> {new_email}")
        
        # Update Main
        await db.registrations.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "full_name": new_name,
                "email": new_email
            }}
        )
        
        # Update Flattened
        await db.event_level_registrations.update_many(
            {"registration_id": str(user["_id"])},
            {"$set": {
                "full_name": new_name
            }}
        )

    print("\n✅ Cleanup complete. No 'Dummy' text remains.")
    client.close()

if __name__ == "__main__":
    asyncio.run(clean_dummy_data())
