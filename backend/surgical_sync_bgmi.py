import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def surgical_sync_bgmi():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    event_id = "bgmi"
    
    # 1. Get all PAID registrations for BGMI
    reg_cursor = db.registrations.find({
        "selected_events": event_id,
        "payment_status": "PAID"
    })
    regs = await reg_cursor.to_list(None)
    print(f"Verified {len(regs)} PAID registrations in main table.")
    
    # 2. Clear existing PAID entries for BGMI in flattened table
    # (Leaving PENDING as is, or we can just refresh the whole event)
    await db.event_level_registrations.delete_many({
        "event_id": event_id,
        "payment_status": "PAID"
    })
    
    # 3. Insert fresh flattened entries
    flattened_entries = []
    for r in regs:
        flat = {
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
            "event_id": event_id,
            "event_name": "BGMI",
            "price": 50 # Verified Golden Price
        }
        flattened_entries.append(flat)
    
    if flattened_entries:
        await db.event_level_registrations.insert_many(flattened_entries)
        print(f"Successfully synced {len(flattened_entries)} PAID records to flattened table.")
    else:
        print("No paid records found to sync.")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(surgical_sync_bgmi())
