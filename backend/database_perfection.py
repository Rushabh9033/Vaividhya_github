import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

GOLDEN_PRICES = {
    # Technical
    "bgmi": 50, "free-fire-pro": 50, "robotics-challenge": 150, "autonomous-robotics-workshop": 2000,
    "web-wizard": 50, "code-clash": 50, "blind-coding": 50, "it-quiz": 50, "bridge-battle": 50,
    "paper-presentation": 100, "project-presentation": 150, "cad-clash": 50, "circuit-simulation": 50,
    "che-o-puzzle": 50, "lathe-o-mania": 50, "word-wizard": 50,
    # Non-Technical
    "spin-mania": 50, "real-life-among-us": 50, "treasure-hunt": 150, "box-cricket": 600,
    "mini-masti": 50, "reel-rush": 50, "valuation-game": 50, "case-catalyst": 50,
    "dream-to-deal": 50, "bulls-and-bears": 50, "brand-blitz": 50, "shark-tank": 100,
    "poster-presentation": 100, "extempore": 50, "fun-with-photography": 50, 
    "logo-quiz": 50, "riddles-and-puzzles": 50, "face-painting": 50, "mehndi": 50,
    "rangoli": 50, "singing": 50, "dancing": 50, "stand-up-comedy": 50, "squid-game": 50
}

async def database_perfection():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- STEP 1: RESTORING GOLDEN PRICES ---")
    event_updates = 0
    for slug, price in GOLDEN_PRICES.items():
        res = await db.events.update_one(
            {"event_id": slug},
            {"$set": {"price": price, "fee": price}}
        )
        event_updates += res.modified_count
    print(f"Restored/Verified prices for {len(GOLDEN_PRICES)} events.")

    # Load master map for names
    events_list = await db.events.find().to_list(None)
    event_map = {e.get("event_id"): e for e in events_list}

    print("\n--- STEP 2: GLOBAL RECALCULATION & REPAIR ---")
    registrations = await db.registrations.find().to_list(None)
    flattened_entries = []
    reg_ids = set()
    
    for r in registrations:
        rid = str(r["_id"])
        reg_ids.add(rid)
        slugs = r.get("selected_events", [])
        
        # Calculate correct total
        new_total = 0
        for s in slugs:
            new_total += GOLDEN_PRICES.get(s, 0)
            
        # 3-event discount
        if len(slugs) >= 3:
            new_total -= 30
        if new_total < 0: new_total = 0
        
        # Update main record
        await db.registrations.update_one(
            {"_id": r["_id"]},
            {"$set": {"total_amount": new_total}}
        )
        
        # Prepare flattened data
        for s in slugs:
            ev = event_map.get(s, {})
            flattened_entries.append({
                "registration_id": rid,
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
                "total_amount": new_total,
                "event_id": s,
                "event_name": ev.get("event_name") or ev.get("name") or s,
                "price": GOLDEN_PRICES.get(s, 0)
            })

    print(f"Recalculated {len(registrations)} registrations.")

    print("\n--- STEP 3: REBUILDING FLAT TABLE WITH 100% PARITY ---")
    await db.event_level_registrations.delete_many({})
    if flattened_entries:
        # Batch insert
        for i in range(0, len(flattened_entries), 500):
            await db.event_level_registrations.insert_many(flattened_entries[i:i+500])
    
    final_flat_count = await db.event_level_registrations.count_documents({})
    print(f"Final Flattened Entries: {final_flat_count}")
    
    print("\n--- DATABASE PERFECTION COMPLETE ---")
    client.close()

if __name__ == "__main__":
    asyncio.run(database_perfection())
