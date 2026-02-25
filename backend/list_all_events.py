import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    events = await db.events.find({}, {"_id": 0, "event_id": 1, "event_name": 1}).to_list(100)
    with open("all_events.txt", "w", encoding="utf-8") as f:
        for e in events:
            f.write(f"ID: {e.get('event_id')} | Name: {e.get('event_name')}\n")
    print("Done writing to all_events.txt")

if __name__ == "__main__":
    asyncio.run(main())
