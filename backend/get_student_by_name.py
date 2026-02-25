import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util
import re

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def get_student_by_name():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    name_query = "Savaliya Srushti mukeshbhai"
    print(f"--- SEARCHING FOR NAME: {name_query} ---")
    
    # Case insensitive search
    regex = re.compile(f"^{re.escape(name_query)}$", re.IGNORECASE)
    
    # 1. Main Registration
    students = await db.registrations.find({"full_name": regex}).to_list(None)
    
    if students:
        print(f"\n--- FOUND {len(students)} MAIN REGISTRATIONS ---")
        for s in students:
            print(json.dumps(s, indent=4, default=json_util.default))
    else:
        print("\n❌ Student not found in 'registrations' collection.")

    # 2. Event Level Entries
    cursor = db.event_level_registrations.find({"full_name": regex})
    events = await cursor.to_list(None)
    
    if events:
        print(f"\n--- FOUND {len(events)} EVENT ENTRIES ---")
        for i, e in enumerate(events, 1):
            print(f"\nEntry #{i}:")
            print(f"  Event: {e.get('event_name')} ({e.get('event_id')})")
            print(f"  Enrollment: {e.get('enrollment_no')}")
            print(f"  Price: {e.get('price')}")
            print(f"  Payment Status: {e.get('payment_status')}")
            print(f"  Approved At: {e.get('approved_at')}")
    else:
        print("\n❌ No event entries found in 'event_level_registrations'.")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(get_student_by_name())
