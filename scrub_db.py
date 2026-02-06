import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def scrub_and_verify():
    MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.vaividhya_db
    stats_collection = db.events_stats
    
    print("Checking for summary rows...")
    # Delete anything with "Total" in the ID
    result = await stats_collection.delete_many({"event_id": {"$regex": "total", "$options": "i"}})
    print(f"Deleted {result.deleted_count} stale summary/total rows.")
    
    count = await stats_collection.count_documents({})
    print(f"Final Count of REAL events in events_stats: {count}")
    
    # List top 5 to verify structure
    docs = await stats_collection.find().to_list(5)
    for d in docs:
        print(f" - {d['event_id']}: {d.get('count', 0)}")

if __name__ == "__main__":
    asyncio.run(scrub_and_verify())
