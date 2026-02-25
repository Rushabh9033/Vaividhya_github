import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def final_count():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    n = await db.event_level_registrations.count_documents({})
    print(f"FINAL_COUNT: {n}")
    client.close()

if __name__ == "__main__":
    asyncio.run(final_count())
