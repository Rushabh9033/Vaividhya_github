import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util
import re

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def find_rushabh_bridge():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- SEARCHING FOR 'Rushabh' IN 'bridge-battle' ---")
    
    regex = re.compile("Rushabh", re.IGNORECASE)
    
    cursor = db.registrations.find({
        "full_name": regex,
        "selected_events": "bridge-battle"
    })
    
    entries = await cursor.to_list(None)
    
    if entries:
        print(f"Found {len(entries)} matching entries:")
        for e in entries:
            print(json.dumps(e, indent=4, default=json_util.default))
    else:
        print("No entry found combining 'Rushabh' and 'bridge-battle'")

    client.close()

if __name__ == "__main__":
    asyncio.run(find_rushabh_bridge())
