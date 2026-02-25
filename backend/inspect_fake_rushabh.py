import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def inspect_fake_rushabh():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Specific fake enrollment from previous step
    enrollment = "FAKE5519" 
    
    entry = await db.registrations.find_one({"enrollment_no": enrollment})
    
    if entry:
        print(f"--- FAKE ENTRY (updated by user?) ---")
        print(json.dumps(entry, indent=4, default=json_util.default))
    else:
        print(f"Could not find fake entry for '{enrollment}'")

    client.close()

if __name__ == "__main__":
    asyncio.run(inspect_fake_rushabh())
