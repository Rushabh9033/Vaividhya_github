import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def find_missing_seven():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- IDENTIFYING MISSING 7 ENTRIES ---")
    
    # 1. Map everything in Flattened
    flat_cursor = db.event_level_registrations.find({"payment_status": "PAID"})
    flat_pairs = set()
    async for f in flat_cursor:
        flat_pairs.add((f.get("enrollment_no"), f.get("event_id")))
        
    # 2. Compare with Main
    reg_cursor = db.registrations.find({"payment_status": "PAID"})
    missing = []
    async for r in reg_cursor:
        enrollment = r.get("enrollment_no")
        slugs = r.get("selected_events", [])
        if not slugs:
            details = r.get("event_details", [])
            slugs = [d.get("event_id") or d.get("slug") for d in details if d.get("event_id") or d.get("slug")]
            
        for s in slugs:
            if (enrollment, s) not in flat_pairs:
                missing.append({
                    "enrollment": enrollment,
                    "event": s,
                    "name": r.get("full_name")
                })
                
    print(f"Found {len(missing)} missing entries:")
    for m in missing:
        print(f"MISSING: {m['enrollment']} | {m['name']} | Event: {m['event']}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(find_missing_seven())
