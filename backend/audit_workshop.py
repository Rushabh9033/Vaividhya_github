import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def audit_workshop():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    event_id = "autonomous-robotics-workshop"
    
    print(f"--- Auditing Event: {event_id} ---")
    
    # 1. Count in registrations collection
    reg_cursor = db.registrations.find({"selected_events": event_id})
    reg_enrollments = set()
    async for r in reg_cursor:
        reg_enrollments.add(r.get("enrollment_no"))
        
    print(f"Count in 'registrations' collection: {len(reg_enrollments)}")
    
    # 2. Count in event_level_registrations collection
    flat_cursor = db.event_level_registrations.find({"event_id": event_id})
    flat_enrollments = set()
    async for f in flat_cursor:
        flat_enrollments.add(f.get("enrollment_no"))
        
    print(f"Count in 'event_level_registrations' collection: {len(flat_enrollments)}")
    
    # 3. Find Mismatches
    missing_in_flat = reg_enrollments - flat_enrollments
    missing_in_regs = flat_enrollments - reg_enrollments
    
    if missing_in_flat:
        print(f"Missing in event_level (Flattened): {missing_in_flat}")
    else:
        print("No missing entries in flattened table.")
        
    if missing_in_regs:
        print(f"Missing in registrations (Main): {missing_in_regs}")
    else:
        print("No missing entries in registrations table.")
    
    # 4. Check for similar/misspelled slugs
    all_regs = db.registrations.find({})
    similar_slugs = set()
    async for r in all_regs:
        for slug in r.get("selected_events", []):
            if "robotic" in slug.lower() and slug != event_id:
                similar_slugs.add(slug)
    
    if similar_slugs:
        print(f"Similar slugs found in registrations: {similar_slugs}")

    client.close()

if __name__ == "__main__":
    asyncio.run(audit_workshop())
