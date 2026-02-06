import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def cleanup():
    MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.vaividhya_db
    
    # 1. Drop the unwanted table
    print("Dropping redundant 'events_stats' collection...")
    await db.drop_collection("events_stats")
    
    # 2. Verify 'event_stats' has 40 entries
    count = await db.event_stats.count_documents({})
    print(f"Collection 'event_stats' now has {count} entries.")

if __name__ == "__main__":
    asyncio.run(cleanup())
