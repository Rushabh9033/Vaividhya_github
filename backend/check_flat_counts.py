import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def checkFlat():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    enrollments = ["250761305022", "e23110125000910080", "e23110125000910086", "e23110125000910056"]
    event_id = "autonomous-robotics-workshop"
    
    print(f"--- Checking event_level_registrations for {event_id} ---")
    for en in enrollments:
        f = await db.event_level_registrations.find_one({"enrollment_no": en, "event_id": event_id})
        if f:
            print(f"FOUND: {en} - {f.get('full_name')}")
        else:
            print(f"MISSING: {en}")
            
    client.close()

if __name__ == "__main__":
    asyncio.run(checkFlat())
