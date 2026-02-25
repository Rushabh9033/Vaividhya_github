import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def inspect_bridge_prices():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Check the 8 users we added/modified
    target_names = ["Rushabh", "neel", "yug", "nikhil", "tirth", "nija", "nemish", "bhargav"]
    
    print("--- INSPECTING PRICES FOR BRIDGE BATTLE USERS ---")
    
    for name in target_names:
        # Case insensitive regex for name
        user = await db.registrations.find_one({
            "full_name": {"$regex": f"^{name}", "$options": "i"},
            "selected_events": "bridge-battle"
        })
        
        if user:
            print(f"\nUser: {user.get('full_name')}")
            print(f"  Total Amount: {user.get('total_amount')}")
            print(f"  Event Details: {json.dumps(user.get('event_details'), default=json_util.default)}")
            
            # Also check flattened
            flat = await db.event_level_registrations.find_one({
                "registration_id": str(user["_id"]),
                "event_id": "bridge-battle"
            })
            if flat:
                 print(f"  [Flattened] Price: {flat.get('price')} | Total: {flat.get('total_amount')}")
        else:
            print(f"\nUser '{name}' not found.")

    client.close()

if __name__ == "__main__":
    asyncio.run(inspect_bridge_prices())
