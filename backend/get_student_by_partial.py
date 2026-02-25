import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util
import re

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def get_student_by_partial_name():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    name_query = "Savaliya Srushti" # Trying partial
    print(f"--- SEARCHING FOR PARTIAL NAME: {name_query} ---")
    
    # Case insensitive partial search
    regex = re.compile(f".*{re.escape(name_query)}.*", re.IGNORECASE)
    
    # 1. Main Registration
    students = await db.registrations.find({"full_name": regex}).to_list(None)
    
    if students:
        print(f"\n--- FOUND {len(students)} POTENTIAL MATCHES ---")
        for s in students:
            print(f"Name: {s.get('full_name')} | Enrollment: {s.get('enrollment_no')}")
    else:
        print("\n❌ No partial matches found.")

    client.close()

if __name__ == "__main__":
    asyncio.run(get_student_by_partial_name())
