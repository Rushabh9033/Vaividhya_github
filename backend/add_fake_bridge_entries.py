import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import random
from datetime import datetime

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def add_fake_entries():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    event_id = "bridge-battle"
    event_price = 50 # Verified from Golden List
    event_name = "Bridge Battle" # Default name
    
    # 1. Get Event Details to be sure
    ev = await db.events.find_one({"event_id": event_id})
    if ev:
        event_name = ev.get("event_name") or ev.get("name") or "Bridge Battle"
        event_price = ev.get("price", 50)
        
    names = ["RUshabh", "neel", "yug", "nikhil", "tirth", "nija", "nemish", "bhargav"]
    fake_date = "2026-02-13"
    fake_time = "10:00:00"
    approved_dt = datetime(2026, 2, 13, 10, 0, 0)
    
    print(f"--- ADDING {len(names)} FAKE ENTRIES FOR {event_name} ---")
    
    for name in names:
        # Generate dummy data
        rand_suffix = random.randint(1000, 9999)
        enrollment = f"FAKE{rand_suffix}"
        
        # Check if enrollment exists, if so retry
        while await db.registrations.find_one({"enrollment_no": enrollment}):
            rand_suffix = random.randint(1000, 9999)
            enrollment = f"FAKE{rand_suffix}"
            
        full_name = f"{name} (Dummy)"
        
        # 1. Main Registration Object
        reg_doc = {
            "full_name": full_name,
            "email": f"{name.lower()}@dummy.com",
            "phone": f"98765{rand_suffix}",
            "enrollment_no": enrollment,
            "college": "Vaividhya Dummy College",
            "department": "Computer",
            "year": "4",
            "selected_events": [event_id],
            "event_details": [{
                "event_id": event_id,
                "name": event_name,
                "price": event_price
            }],
            "total_amount": event_price,
            "payment_status": "PAID",
            "payment_id": f"PAY_FAKE_{rand_suffix}",
            "register_date": fake_date,
            "register_time": fake_time,
            "approved_by": "System Admin",
            "approved_at": approved_dt,
            "is_offline": True # Mark as offline/fake
        }
        
        res = await db.registrations.insert_one(reg_doc)
        reg_id = str(res.inserted_id)
        
        # 2. Flattened Entry Object
        flat_doc = {
            "registration_id": reg_id,
            "full_name": full_name,
            "enrollment_no": enrollment,
            "mobile_no": f"98765{rand_suffix}",
            "college_name": "Vaividhya Dummy College",
            "dept": "Computer",
            "sem": "4",
            "payment_status": "PAID",
            "approved_by": "System Admin",
            "approved_at": approved_dt, # Important for reports
            "register_date": fake_date,
            "total_amount": event_price,
            "event_id": event_id,
            "event_name": event_name,
            "price": event_price
        }
        
        await db.event_level_registrations.insert_one(flat_doc)
        print(f"Added: {full_name} | {enrollment}")

    print("\n✅ Successfully added 8 fake entries.")
    
    # Verify count
    count = await db.event_level_registrations.count_documents({"event_id": event_id, "payment_status": "PAID"})
    print(f"Total PAID '{event_id}' entries now: {count}")

    client.close()

if __name__ == "__main__":
    asyncio.run(add_fake_entries())
