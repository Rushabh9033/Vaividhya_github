import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def inspectRegistrants():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    event_id = "autonomous-robotics-workshop"
    enrollments = ["250761305022", "e23110125000910080", "e23110125000910086", "e23110125000910056"]
    
    inspect_results = []
    for en in enrollments:
        r = await db.registrations.find_one({"enrollment_no": en})
        if r:
            r["_id"] = str(r["_id"])
            inspect_results.append(r)
            
    with open("registrant_inspect.json", "w") as f:
        json.dump(inspect_results, f, indent=4)
        
    client.close()

if __name__ == "__main__":
    asyncio.run(inspectRegistrants())
