import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def diagnostic():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Collections in {DB_NAME}:")
    cols = await db.list_collection_names()
    print(cols)
    
    if "registrations" in cols:
        print("\nSampling 2 registrations:")
        regs = await db.registrations.find().to_list(2)
        for r in regs:
            print(f"- ID: {r.get('_id')}, Total: {r.get('total_amount')}, Events: {r.get('selected_events')}")
    else:
        print("\n!!! 'registrations' collection NOT FOUND in 'vaividhya_db' !!!")
        
    print("\nEvents with price 100:")
    evs = await db.events.find({"price": 100}).to_list(100)
    for e in evs:
        print(f"- {e.get('event_id')}: {e.get('price')}")

    print("\nEvents with price 50:")
    evs = await db.events.find({"price": 50}).to_list(100)
    for e in evs:
        print(f"- {e.get('event_id')}: {e.get('price')}")

    client.close()

if __name__ == "__main__":
    asyncio.run(diagnostic())
