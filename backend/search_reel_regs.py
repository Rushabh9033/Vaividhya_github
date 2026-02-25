import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # Search in original registrations
    query = {
        "$or": [
            {"selected_events": {"$regex": "reel", "$options": "i"}},
            {"event_details.event_name": {"$regex": "reel", "$options": "i"}}
        ]
    }
    
    results = await db.registrations.find(query).to_list(1000)
    print(f"--- REGISTRATIONS WITH 'REEL': {len(results)} ---")
    for r in results:
        evs = r.get("selected_events", [])
        dets = [d.get("event_name") for d in r.get("event_details", [])]
        print(f"Name: {r.get('full_name')} | Slugs: {evs} | Details: {dets}")

if __name__ == "__main__":
    asyncio.run(main())
