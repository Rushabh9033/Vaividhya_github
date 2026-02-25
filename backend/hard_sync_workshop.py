import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def hard_sync_workshop():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    workshop_id = "autonomous-robotics-workshop"
    
    # 1. Ensure master price is correct (₹2000 as per eventsData.js)
    await db.events.update_one(
        {"event_id": workshop_id},
        {"$set": {"price": 2000, "name": "Autonomous Robotics Workshop", "event_name": "Autonomous Robotics Workshop"}}
    )
    print("Master price verified: ₹2000")
    
    # 2. Get all registrations for this workshop
    reg_cursor = db.registrations.find({"selected_events": workshop_id})
    regs = await reg_cursor.to_list(None)
    print(f"Found {len(regs)} registrations in main table.")
    
    # 3. Clear existing flattened entries for this workshop ONLY
    await db.event_level_registrations.delete_many({"event_id": workshop_id})
    
    # 4. Re-insert flattened entries
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
            "payment_status": r.get("payment_status", "PENDING"),
            "approved_by": r.get("approved_by"),
            "approved_at": r.get("approved_at"),
            "register_date": r.get("register_date"),
            "total_amount": r.get("total_amount"),
            "event_id": workshop_id,
            "event_name": "Autonomous Robotics Workshop",
            "price": 2000
        }
        flattened_entries.append(flat)
    
    if flattened_entries:
        await db.event_level_registrations.insert_many(flattened_entries)
        print(f"Successfully synced {len(flattened_entries)} records to flattened table.")
    else:
        print("No records found to sync.")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(hard_sync_workshop())
