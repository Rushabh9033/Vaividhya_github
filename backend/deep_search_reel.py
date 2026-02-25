import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # Check all events in DB
    events = await db.events.find().to_list(100)
    print("--- ALL DB EVENTS ---")
    for e in events:
        print(f"{e.get('event_id')} | {e.get('event_name')}")
        
    # Check for any event with 'reel' or 'rush' or 'video' or 'making'
    query = {
        "$or": [
            {"selected_events": {"$regex": "reel|rush|video|making", "$options": "i"}},
            {"event_details.event_name": {"$regex": "reel|rush|video|making", "$options": "i"}}
        ]
    }
    regs = await db.registrations.find(query).to_list(1000)
    print(f"\n--- MATCHING REGS: {len(regs)} ---")
    for r in regs:
        print(f"Name: {r.get('full_name')} | Events: {r.get('selected_events')} | Details: {[d.get('event_name') for d in r.get('event_details', [])]}")

if __name__ == "__main__":
    asyncio.run(main())
