import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def forensic_audit():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- 1. AUDITING MAIN REGISTRATIONS ---")
    reg_cursor = db.registrations.find({"payment_status": "PAID"})
    main_paid_entries = 0
    async for r in reg_cursor:
        slugs = r.get("selected_events", [])
        if not slugs:
            details = r.get("event_details", [])
            slugs = [d.get("event_id") or d.get("slug") for d in details if d.get("event_id") or d.get("slug")]
        main_paid_entries += len(slugs)
        
    print(f"Total PAID entries expected from main table: {main_paid_entries}")
    
    print("\n--- 2. AUDITING FLATTENED TABLE ---")
    flat_paid_count = await db.event_level_registrations.count_documents({"payment_status": "PAID"})
    print(f"Total PAID entries found in flattened table (No date filter): {flat_paid_count}")
    
    print("\n--- 3. CHECKING FOR MISSING DATES ---")
    no_date_cursor = db.event_level_registrations.find({
        "payment_status": "PAID",
        "approved_at": None,
        "register_date": None
    })
    no_date_count = await db.event_level_registrations.count_documents({
        "payment_status": "PAID",
        "approved_at": None,
        "register_date": None
    })
    print(f"PAID entries with NO DATE at all: {no_date_count}")
    
    print("\n--- 4. CHECKING PRE-JAN 28 ENTRIES ---")
    # This is harder with string dates, but let's see if there are any that my script would categorize as < "2026-01-28"
    all_flat = await db.event_level_registrations.find({"payment_status": "PAID"}).to_list(None)
    pre_jan_count = 0
    for e in all_flat:
        raw_date = e.get("approved_at") or e.get("register_date")
        if not raw_date: continue
        dstr = str(raw_date)[:10]
        if dstr < "2026-01-28" and dstr != "Legacy/Misc":
            pre_jan_count += 1
            
    print(f"PAID entries dated BEFORE Jan 28: {pre_jan_count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(forensic_audit())
