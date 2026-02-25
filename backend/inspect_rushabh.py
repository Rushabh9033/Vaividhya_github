import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util
import re

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def inspect_reference_entry():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Search for RUshabh (case insensitive partial)
    regex = re.compile("RUshabh", re.IGNORECASE)
    entry = await db.registrations.find_one({"full_name": regex})
    
    if entry:
        print("--- REFERENCE ENTRY (RUshabh) ---")
        print(json.dumps(entry, indent=4, default=json_util.default))
    else:
        print("Could not find reference entry for 'RUshabh'")

    client.close()

if __name__ == "__main__":
    asyncio.run(inspect_reference_entry())
