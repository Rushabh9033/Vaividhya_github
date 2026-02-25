import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def hard_verify():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    workshop_id = "autonomous-robotics-workshop"
    results = {
        "registrations_list": []
    }
    
    # 2. Main Registrations
    reg_cursor = db.registrations.find({"$or": [
        {"selected_events": workshop_id},
        {"event_details.event_id": workshop_id},
        {"event_details.slug": workshop_id}
    ]})
    async for r in reg_cursor:
        results["registrations_list"].append({
            "enrollment_no": r.get("enrollment_no"),
            "full_name": r.get("full_name"),
            "selected_events": r.get("selected_events", []),
            "event_details": r.get("event_details", [])
        })
    
    with open("audit_full_registrants.json", "w") as f:
        json.dump(results, f, indent=4)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(hard_verify())
