import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def get_student_info():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    enrollment = "250760116100"
    print(f"--- SEARCHING FOR ENROLLMENT: {enrollment} ---")
    
    # 1. Main Registration
    student = await db.registrations.find_one({"enrollment_no": enrollment})
    
    if student:
        print("\n--- MAIN REGISTRATION DETAILS ---")
        print(json.dumps(student, indent=4, default=json_util.default))
    else:
        print("\n❌ Student not found in 'registrations' collection.")

    # 2. Event Level Entries
    cursor = db.event_level_registrations.find({"enrollment_no": enrollment})
    events = await cursor.to_list(None)
    
    if events:
        print(f"\n--- FOUND {len(events)} EVENT ENTRIES ---")
        for i, e in enumerate(events, 1):
            print(f"\nEntry #{i}:")
            print(f"  Event: {e.get('event_name')} ({e.get('event_id')})")
            print(f"  Price: {e.get('price')}")
            print(f"  Payment Status: {e.get('payment_status')}")
            print(f"  Approved At: {e.get('approved_at')}")
    else:
        print("\n❌ No event entries found in 'event_level_registrations'.")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(get_student_info())
