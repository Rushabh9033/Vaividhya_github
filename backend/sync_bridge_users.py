import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import random
import re

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def sync_fake_users():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # The 7 users to update
    target_names = ["neel", "yug", "nikhil", "tirth", "nija", "nemish", "bhargav"]
    
    # Template details from RUshabh
    template = {
        "college": "ssasit",
        "department": "msc.it",
        "dept": "msc.it", # for flattened
        "year": "4",
        "sem": "4", # for flattened
        "is_offline": True,
        "college_name": "ssasit" # for flattened
    }
    
    print(f"--- UPDATING {len(target_names)} USERS TO MATCH TEMPLATE ---")
    
    for name in target_names:
        # Generate semantic enrollment similar to RUshabh's (220761305039)
        # 22076130xxxx
        rand_suffix = random.randint(5040, 5099)
        new_enrollment = f"22076130{rand_suffix}"
        
        # Check uniqueness
        while await db.registrations.find_one({"enrollment_no": new_enrollment}):
             rand_suffix = random.randint(5040, 5099)
             new_enrollment = f"22076130{rand_suffix}"
             
        # Find the user by name (case insensitive) and event
        regex = re.compile(f"^{name}.*", re.IGNORECASE)
        query = {
            "full_name": regex, 
            "selected_events": "bridge-battle"
        }
        
        user = await db.registrations.find_one(query)
        
        if user:
            print(f"Updating {user['full_name']}...")
            
            # Update Main Registration
            await db.registrations.update_one(
                {"_id": user["_id"]},
                {"$set": {
                    "college": template["college"],
                    "department": template["department"],
                    "year": template["year"],
                    "is_offline": template["is_offline"],
                    "enrollment_no": new_enrollment # Updating to realistic enrollment
                }}
            )
            
            # Update Flattened Entry
            await db.event_level_registrations.update_one(
                {"registration_id": str(user["_id"]), "event_id": "bridge-battle"},
                {"$set": {
                    "college_name": template["college_name"],
                    "dept": template["dept"],
                    "sem": template["sem"],
                    "enrollment_no": new_enrollment # Updating to realistic enrollment
                }}
            )
            print(f"  -> Set College: {template['college']}, Dept: {template['department']}, Enrollment: {new_enrollment}")
            
        else:
            print(f"⚠️ Could not find user '{name}' in bridge-battle list.")

    print("\n✅ Sync complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(sync_fake_users())
