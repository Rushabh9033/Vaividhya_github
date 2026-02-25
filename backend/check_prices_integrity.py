import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def check_prices():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    events = await db.events.find({}).to_list(100)
    print("--- CURRENT DATABASE PRICES ---")
    for e in events:
        print(f"{e.get('event_id')}: {e.get('price')}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(check_prices())
