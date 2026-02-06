import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.vaividhya_db
    stats_collection = db.events_stats
    
    count = await stats_collection.count_documents({})
    print(f"Total documents in events_stats: {count}")
    
    unwanted = await stats_collection.find({"event_id": {"$regex": "Total", "$options": "i"}}).to_list(10)
    print(f"Unwanted 'Total' rows found: {len(unwanted)}")
    for doc in unwanted:
        print(f" - {doc['event_id']}")

if __name__ == "__main__":
    asyncio.run(check())
