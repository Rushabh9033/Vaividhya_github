import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # Search for reel-rush
    query = {
        "$or": [
            {"event_id": "reel-rush"},
            {"event_name": {"$regex": "Reel Rush", "$options": "i"}}
        ]
    }
    
    results = await db.event_level_registrations.find(query).to_list(1000)
    print(f"--- REEL RUSH (FLATTENED) ENTRIES FOUND: {len(results)} ---")
    for r in results:
        print(f"Name: {r.get('full_name')} | Enrollment: {r.get('enrollment_no')} | Status: {r.get('payment_status')}")

    # Search in original registrations too
    query_orig = {
        "$or": [
            {"selected_events": "reel-rush"},
            {"event_details.event_id": "reel-rush"},
            {"event_details.event_name": {"$regex": "Reel Rush", "$options": "i"}}
        ]
    }
    results_orig = await db.registrations.find(query_orig).to_list(1000)
    print(f"\n--- REEL RUSH (ORIGINAL) ENTRIES FOUND: {len(results_orig)} ---")
    for r in results_orig:
         print(f"Name: {r.get('full_name')} | Enrollment: {r.get('enrollment_no')} | Events: {r.get('selected_events')}")

if __name__ == "__main__":
    asyncio.run(main())
