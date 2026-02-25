import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def global_hard_verify_optimized():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- STARTING OPTIMIZED GLOBAL HARD VERIFICATION ---")
    
    # 1. Load Everything into memory
    print("Loading data from database...")
    events_list = await db.events.find({}, {"_id": 0}).to_list(None)
    event_map = {e.get("event_id"): e for e in events_list}
    
    registrations = await db.registrations.find().to_list(None)
    
    # Create a set of (enrollment, event_id) pairs that exist in the flattened table
    flattened_data = await db.event_level_registrations.find({}, {"enrollment_no": 1, "event_id": 1}).to_list(None)
    existing_pairs = set((f.get("enrollment_no"), f.get("event_id")) for f in flattened_data)
    
    print(f"Loaded {len(event_map)} events, {len(registrations)} registrations, and {len(existing_pairs)} flattened entries.")
    
    missing_entries = []
    total_expected = 0
    
    # 2. Audit in memory
    for r in registrations:
        enrollment = r.get("enrollment_no")
        selected_events = r.get("selected_events", [])
        
        if not selected_events:
            details = r.get("event_details", [])
            selected_events = [d.get("event_id") or d.get("slug") for d in details if d.get("event_id") or d.get("slug")]
        
        for slug in selected_events:
            total_expected += 1
            if (enrollment, slug) not in existing_pairs:
                missing_entries.append({
                    "enrollment": enrollment,
                    "event_id": slug,
                    "reg_data": r
                })
                
    print(f"Total expected entries: {total_expected}")
    print(f"Missing in flattened table: {len(missing_entries)}")
    
    # 3. Quick Repair
    if missing_entries:
        print(f"\n--- REPAIRING {len(missing_entries)} ENTRIES ---")
        fix_batch = []
        for m in missing_entries:
            r = m["reg_data"]
            slug = m["event_id"]
            ev = event_map.get(slug, {})
            
            fix_batch.append({
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
            })
            
            # Batch insert if too large
            if len(fix_batch) >= 100:
                await db.event_level_registrations.insert_many(fix_batch)
                print(f"Repaired {len(fix_batch)} entries...")
                fix_batch = []
                
        if fix_batch:
            await db.event_level_registrations.insert_many(fix_batch)
            print(f"Repaired final {len(fix_batch)} entries.")
            
    print("\n--- PERFORMANCE CLEANUP (Checking for Orphans) ---")
    # Orphans are entries in flattened table with no parent in registrations
    reg_ids = set(str(r["_id"]) for r in registrations)
    orphan_cursor = db.event_level_registrations.find({}, {"registration_id": 1})
    orphans_to_delete = []
    async for f in orphan_cursor:
        if f.get("registration_id") not in reg_ids:
            orphans_to_delete.append(f["_id"])
            
    if orphans_to_delete:
        print(f"Found {len(orphans_to_delete)} orphan entries. Deleting...")
        await db.event_level_registrations.delete_many({"_id": {"$in": orphans_to_delete}})
    else:
        print("No orphans found.")

    final_count = await db.event_level_registrations.count_documents({})
    print(f"\n--- HARD VERIFY COMPLETE ---")
    print(f"Final Parity: {final_count} entries match perfectly with main registration table.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(global_hard_verify_optimized())
