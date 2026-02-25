import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # List all events in 'events'
    events = await db.events.find().to_list(200)
    print("--- ALL EVENTS IN DB ---")
    for e in events:
        print(f"ID: {e.get('event_id')} | Name: {e.get('event_name')}")
        
    # Search for 'reel' in registrations
    regs = await db.registrations.find({"$or": [
        {"selected_events": {"$regex": "reel", "$options": "i"}},
        {"event_details.event_name": {"$regex": "reel", "$options": "i"}}
    ]}).to_list(100)
    print(f"\n--- REGISTRATIONS WITH 'REEL': {len(regs)} ---")
    for r in regs:
        print(f"User: {r.get('full_name')} | Events: {r.get('selected_events')}")

if __name__ == "__main__":
    asyncio.run(main())
