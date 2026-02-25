import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def audit_bgmi_paid():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    event_id = "bgmi"
    
    print(f"--- Auditing Event: {event_id} (PAID ONLY) ---")
    
    # 1. Count in registrations collection
    reg_paid_count = await db.registrations.count_documents({
        "selected_events": event_id,
        "payment_status": "PAID"
    })
    print(f"Paid registrations in 'registrations': {reg_paid_count}")
    
    # 2. Count in event_level_registrations collection
    flat_paid_count = await db.event_level_registrations.count_documents({
        "event_id": event_id,
        "payment_status": "PAID"
    })
    print(f"Paid entries in 'event_level_registrations': {flat_paid_count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(audit_bgmi_paid())
