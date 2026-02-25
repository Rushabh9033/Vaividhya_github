import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def surgical_repair_seven():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # 1. Map everything in Flattened
    flat_cursor = db.event_level_registrations.find({"payment_status": "PAID"})
    flat_pairs = set()
    async for f in flat_cursor:
        flat_pairs.add((f.get("enrollment_no"), f.get("event_id")))
        
    # 2. Get Master Event map for details
    events_list = await db.events.find().to_list(None)
    event_map = {e.get("event_id"): e for e in events_list}

    # 3. Find and Repair
    reg_cursor = db.registrations.find({"payment_status": "PAID"})
    repaired_count = 0
    async for r in reg_cursor:
        enrollment = r.get("enrollment_no")
        slugs = r.get("selected_events", [])
        if not slugs:
            details = r.get("event_details", [])
            slugs = [d.get("event_id") or d.get("slug") for d in details if d.get("event_id") or d.get("slug")]
            
        for s in slugs:
            if (enrollment, s) not in flat_pairs:
                ev = event_map.get(s, {})
                flat_entry = {
                    "registration_id": str(r["_id"]),
                    "full_name": r.get("full_name"),
                    "enrollment_no": r.get("enrollment_no"),
                    "mobile_no": r.get("mobile_no") or r.get("phone"),
                    "college_name": r.get("college_name") or r.get("college"),
                    "dept": r.get("dept") or r.get("department"),
                    "sem": r.get("sem") or r.get("year"),
                    "payment_status": "PAID",
                    "approved_by": r.get("approved_by"),
                    "approved_at": r.get("approved_at"),
                    "register_date": r.get("register_date"),
                    "total_amount": r.get("total_amount"),
                    "event_id": s,
                    "event_name": ev.get("event_name") or ev.get("name") or s,
                    "price": ev.get("price", 0)
                }
                await db.event_level_registrations.insert_one(flat_entry)
                repaired_count += 1
                
    print(f"Repaired {repaired_count} missing entries.")
    final_count = await db.event_level_registrations.count_documents({"payment_status": "PAID"})
    print(f"Final PAID count in flattened table: {final_count}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(surgical_repair_seven())
