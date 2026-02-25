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
        "master_event": None,
        "registrations_count": 0,
        "registrations_list": [],
        "flattened_count": 0,
        "flattened_list": [],
        "similar_slugs_in_db": []
    }
    
    # 1. Master Event
    ev = await db.events.find_one({"event_id": workshop_id})
    if ev:
        ev["_id"] = str(ev["_id"])
        results["master_event"] = ev
        
    # 2. Main Registrations
    reg_cursor = db.registrations.find({"selected_events": workshop_id})
    async for r in reg_cursor:
        results["registrations_list"].append({
            "enrollment_no": r.get("enrollment_no"),
            "full_name": r.get("full_name"),
            "payment_status": r.get("payment_status")
        })
    results["registrations_count"] = len(results["registrations_list"])
    
    # 3. Flattened
    flat_cursor = db.event_level_registrations.find({"event_id": workshop_id})
    async for f in flat_cursor:
        results["flattened_list"].append({
            "enrollment_no": f.get("enrollment_no"),
            "full_name": f.get("full_name")
        })
    results["flattened_count"] = len(results["flattened_list"])
    
    # 4. Similar slugs
    all_events = await db.events.distinct("event_id")
    results["similar_slugs_in_db"] = [s for s in all_events if "robot" in s.lower()]
    
    with open("audit_results.json", "w") as f:
        json.dump(results, f, indent=4)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(hard_verify())
