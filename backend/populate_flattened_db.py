import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # 1. Collections
    regs_col = db.registrations
    events_col = db.events
    out_col = db.event_level_registrations
    
    print("Fetching data...")
    
    # 2. Fetch all events for mapping
    events_list = await events_col.find({}, {"_id": 0}).to_list(100)
    event_map = {e.get("event_id") or e.get("slug"): e for e in events_list}
    
    # 3. Fetch all registrations
    regs = await regs_col.find().to_list(3000)
    
    print(f"Processing {len(regs)} registrations...")
    
    flattened = []
    for r in regs:
        # Base user info
        user_info = {
            "reg_original_id": str(r["_id"]),
            "full_name": r.get("full_name", "N/A"),
            "enrollment_no": r.get("enrollment_no", "N/A"),
            "email": r.get("email", "N/A"),
            "phone": r.get("phone", "N/A"),
            "college": r.get("college", "N/A"),
            "department": r.get("department", "N/A"),
            "year": r.get("year", "N/A"),
            "payment_status": r.get("payment_status", "PENDING"),
            "approved_by": r.get("approved_by"),
            "approved_at": r.get("approved_at"),
            "register_date": r.get("register_date"),
            "register_time": r.get("register_time")
        }
        
        ev_list = r.get("selected_events", [])
        details = r.get("event_details", [])
        
        # Priority on event_details
        if details and isinstance(details, list):
            for detail in details:
                ev_info = user_info.copy()
                ev_info.update({
                    "event_id": detail.get("event_id") or detail.get("event_name"),
                    "event_name": detail.get("event_name"),
                    "event_category": detail.get("category") or "N/A",
                    "price": detail.get("price", 0)
                })
                flattened.append(ev_info)
        elif ev_list and isinstance(ev_list, list):
            for slug in ev_list:
                ev_data = event_map.get(slug, {})
                ev_info = user_info.copy()
                ev_info.update({
                    "event_id": slug,
                    "event_name": ev_data.get("event_name") or ev_data.get("name") or slug,
                    "event_category": ev_data.get("category", "N/A"),
                    "price": ev_data.get("price") or ev_data.get("fee") or 0
                })
                flattened.append(ev_info)

    print(f"Flattening complete. Total event rows: {len(flattened)}")
    
    # 4. Clear and insert into new collection
    print("Clearing 'event_level_registrations' collection...")
    await out_col.delete_many({})
    
    if flattened:
        print(f"Inserting {len(flattened)} rows...")
        await out_col.insert_many(flattened)
    
    print("SUCCESS: MongoDB flattened collection is ready!")

if __name__ == "__main__":
    asyncio.run(main())
