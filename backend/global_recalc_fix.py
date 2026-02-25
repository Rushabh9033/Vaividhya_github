import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def global_recalc():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- 1. MASTER PRICE AUDIT ---")
    event_cursor = db.events.find({})
    event_map = {}
    async for e in event_cursor:
        event_map[e["event_id"]] = e.get("price", 0)
    print(f"Loaded {len(event_map)} master event prices.")

    print("\n--- 2. UPDATING ALL REGISTRATIONS (TOTALS & DATA) ---")
    reg_cursor = db.registrations.find({})
    updated_regs = 0
    
    async for r in reg_cursor:
        selected_slugs = r.get("selected_events", [])
        if not selected_slugs:
            continue
            
        # Recalculate Total
        current_total = 0
        for slug in selected_slugs:
            current_total += event_map.get(slug, 0)
            
        # Apply 3-event discount (₹30)
        if len(selected_slugs) >= 3:
            current_total -= 30
        if current_total < 0: current_total = 0
        
        # Update registration document
        await db.registrations.update_one(
            {"_id": r["_id"]},
            {"$set": {"total_amount": current_total}}
        )
        updated_regs += 1

    print(f"Recalculated totals for {updated_regs} registrations.")

    print("\n--- 3. RE-SYNCING FLATTENED EVENT_LEVEL_REGISTRATIONS ---")
    # Clear and rebuild flattened table to ensure data integrity
    await db.event_level_registrations.delete_many({})
    
    # Re-fetch all events for the latest name mapped data
    events_list = await db.events.find({}, {"_id": 0}).to_list(100)
    event_data_map = {e.get("event_id"): e for e in events_list}
    
    regs = await db.registrations.find().to_list(10000)
    flattened_entries = []
    
    for r in regs:
        base_info = {
            "registration_id": str(r["_id"]),
            "full_name": r.get("full_name"),
            "enrollment_no": r.get("enrollment_no"),
            "mobile_no": r.get("mobile_no") or r.get("phone"),
            "college_name": r.get("college_name") or r.get("college"),
            "dept": r.get("dept") or r.get("department"),
            "sem": r.get("sem") or r.get("year"),
            "payment_status": r.get("payment_status", "PENDING"),
            "approved_by": r.get("approved_by"),
            "approved_at": r.get("approved_at"), # Payment Date
            "register_date": r.get("register_date"),
            "total_amount": r.get("total_amount")
        }
        
        for slug in r.get("selected_events", []):
            ev = event_data_map.get(slug, {})
            flat = base_info.copy()
            flat.update({
                "event_id": slug,
                "event_name": ev.get("event_name") or ev.get("name") or slug,
                "price": ev.get("price", 0)
            })
            flattened_entries.append(flat)
            
    if flattened_entries:
        await db.event_level_registrations.insert_many(flattened_entries)
    
    print(f"Flattened {len(flattened_entries)} records with updated pricing and payment dates.")
    print("\n--- GLOBAL DATA FIX COMPLETE ---")
    client.close()

if __name__ == "__main__":
    asyncio.run(global_recalc())
