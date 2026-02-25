import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def sync_data():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # 1. Fetch Master Mapping
    events_list = await db.events.find({}, {"_id": 0}).to_list(100)
    event_map = {e.get("event_id") or e.get("slug"): e for e in events_list}
    
    # 2. Fetch All Registrations (Newest scan)
    regs = await db.registrations.find().to_list(5000)
    print(f"Syncing {len(regs)} registrations...")
    
    flattened = []
    for r in regs:
        # User base info
        user_info = {
            "reg_original_id": str(r["_id"]),
            "full_name": r.get("full_name", "N/A"),
            "enrollment_no": r.get("enrollment_no", "N/A"),
            "email": r.get("email", "N/A"),
            "phone": r.get("phone", "N/A"),
            "payment_status": r.get("payment_status", "PENDING"),
            "approved_by": r.get("approved_by"),
            "register_date": r.get("register_date"),
            "register_time": r.get("register_time"),
            "total_amount": r.get("total_amount", 0)
        }
        
        # Process Events
        details = r.get("event_details", [])
        slugs = r.get("selected_events", [])
        
        if details and isinstance(details, list):
            for d in details:
                row = user_info.copy()
                row.update({
                    "event_id": d.get("event_id") or d.get("event_name"),
                    "event_name": d.get("event_name"),
                    "event_category": d.get("category") or "N/A",
                    "price": d.get("price", 0)
                })
                flattened.append(row)
        elif slugs and isinstance(slugs, list):
            for slug in slugs:
                ev_data = event_map.get(slug, {})
                row = user_info.copy()
                row.update({
                    "event_id": slug,
                    "event_name": ev_data.get("event_name") or ev_data.get("name") or slug,
                    "event_category": ev_data.get("category", "N/A"),
                    "price": ev_data.get("price") or ev_data.get("fee") or 0
                })
                flattened.append(row)
                
    # 3. Guard: Clear and Re-insert
    await db.event_level_registrations.delete_many({})
    if flattened:
        await db.event_level_registrations.insert_many(flattened)
        print(f"SUCCESS: Flattened table synced with {len(flattened)} rows.")
        paid_count = sum(1 for f in flattened if f['payment_status'] == 'PAID')
        print(f"Total PAID event rows: {paid_count}")

if __name__ == "__main__":
    asyncio.run(sync_data())
