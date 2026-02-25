import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def global_hard_verify():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- STARTING GLOBAL HARD VERIFICATION ---")
    
    # 1. Load Master Events Map
    events_list = await db.events.find({}, {"_id": 0}).to_list(100)
    event_map = {e.get("event_id"): e for e in events_list}
    print(f"Loaded {len(event_map)} master event definitions.")
    
    # 2. Audit Registrations
    registrations = await db.registrations.find().to_list(10000)
    print(f"Auditing results for {len(registrations)} total registrations...")
    
    missing_entries = []
    total_expected = 0
    total_found = 0
    
    for r in registrations:
        enrollment = r.get("enrollment_no")
        selected_events = r.get("selected_events", [])
        
        # Check for empty selected_events vs event_details
        if not selected_events:
            # Check if stored in event_details instead
            details = r.get("event_details", [])
            selected_events = [d.get("event_id") or d.get("slug") for d in details if d.get("event_id") or d.get("slug")]
        
        for slug in selected_events:
            total_expected += 1
            # Check if exists in flattened table
            f = await db.event_level_registrations.find_one({"enrollment_no": enrollment, "event_id": slug})
            if f:
                total_found += 1
            else:
                missing_entries.append({
                    "enrollment": enrollment,
                    "event_id": slug,
                    "reg_data": r
                })
                
    print(f"Matches found: {total_found}")
    print(f"Missing in flattened table: {len(missing_entries)}")
    
    # 3. Fix Discrepancies
    if missing_entries:
        print(f"\n--- FIXING {len(missing_entries)} DISCREPANCIES ---")
        fix_count = 0
        for m in missing_entries:
            r = m["reg_data"]
            slug = m["event_id"]
            ev = event_map.get(slug, {})
            
            flat_entry = {
                "registration_id": str(r["_id"]),
                "full_name": r.get("full_name"),
                "enrollment_no": r.get("enrollment_no"),
                "mobile_no": r.get("mobile_no") or r.get("phone"),
                "college_name": r.get("college_name") or r.get("college"),
                "dept": r.get("dept") or r.get("department"),
                "sem": r.get("sem") or r.get("year"),
                "payment_status": r.get("payment_status", "PENDING"),
                "approved_by": r.get("approved_by"),
                "approved_at": r.get("approved_at"),
                "register_date": r.get("register_date"),
                "total_amount": r.get("total_amount"),
                "event_id": slug,
                "event_name": ev.get("event_name") or ev.get("name") or slug,
                "price": ev.get("price", 0)
            }
            await db.event_level_registrations.insert_one(flat_entry)
            fix_count += 1
        print(f"Successfully repaired {fix_count} missing entries.")
    
    # 4. Check for Orphans (entries in flattened that don't exist in main)
    # This might happen if a registration was deleted but flattened remained.
    # We will skip orphans for now unless count is significantly off.
    
    flattened_count = await db.event_level_registrations.count_documents({})
    print(f"\n--- FINAL AUDIT SUMMARY ---")
    print(f"Total Main Registrations: {len(registrations)}")
    print(f"Total Flattened Entries: {flattened_count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(global_hard_verify())
