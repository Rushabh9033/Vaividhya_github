import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# Configuration
MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

# Master Event List (Derived from the latest frontend eventsData.js)
# Prices updated: Robo Football Clash (50), Word Wizard (50), Reel Rush (50), etc.
MASTER_EVENTS = [
    {"event_id": "reverse-coding", "name": "Reverse Coding", "price": 50},
    {"event_id": "blind-code", "name": "Blind Code", "price": 50},
    {"event_id": "ai-quiz", "name": "AI Quiz", "price": 50},
    {"event_id": "ai-hunting", "name": "AI Hunting", "price": 50},
    {"event_id": "web-treasure-hunting", "name": "Web Treasure Hunting", "price": 0},
    {"event_id": "ai-shape-cipher", "name": "AI Shape Cipher", "price": 50},
    {"event_id": "ai-prompt-battle", "name": "AI Prompt Battle", "price": 50},
    {"event_id": "robo-war-pro", "name": "Robo War Pro", "price": 100},
    {"event_id": "drone-dash", "name": "Drone Dash", "price": 100},
    {"event_id": "robo-football-clash", "name": "Robo Football Clash", "price": 50},
    {"event_id": "robo-rush", "name": "Robo Rush", "price": 100},
    {"event_id": "robo-mind-matrix", "name": "Robo Mind Matrix", "price": 50},
    {"event_id": "autonomous-robotics-workshop", "name": "Autonomous Robotics Workshop", "price": 2000},
    {"event_id": "robotics-challenge", "name": "Robotics Challenge", "price": 150},
    {"event_id": "break-the-bot", "name": "Break The Bot", "price": 50},
    {"event_id": "mystic-mover", "name": "Mystic Mover", "price": 50},
    {"event_id": "puzzle-hunt", "name": "Puzzle Hunt", "price": 50},
    {"event_id": "case-catalyst", "name": "Case Catalyst", "price": 50},
    {"event_id": "adrena", "name": "ADRENA", "price": 50},
    {"event_id": "biz-brain-challenge", "name": "Biz Brain Challenge", "price": 50},
    {"event_id": "bull-vs-bear", "name": "Bull vs Bear", "price": 50},
    {"event_id": "dream-to-deal", "name": "Dream to Deal", "price": 50},
    {"event_id": "logo-hunt", "name": "Logo Hunt", "price": 50},
    {"event_id": "fold-and-build", "name": "Fold and Build", "price": 50},
    {"event_id": "bridge-battle", "name": "Bridge Battle", "price": 100},
    {"event_id": "quantum-quest-physics", "name": "Quantum Quest Physics", "price": 50},
    {"event_id": "the-chemical-detective", "name": "The Chemical Detective", "price": 50},
    {"event_id": "cricket-carnival", "name": "Cricket Carnival", "price": 50},
    {"event_id": "bgmi", "name": "BGMI", "price": 50},
    {"event_id": "free-fire-pro", "name": "Free Fire Pro", "price": 50},
    {"event_id": "ludo-king", "name": "Ludo King", "price": 50},
    {"event_id": "spin-mania", "name": "Spin Mania", "price": 50},
    {"event_id": "escape-room", "name": "Escape Room", "price": 50},
    {"event_id": "mini-musti-for-1-min", "name": "Mini Musti for 1 Min", "price": 50},
    {"event_id": "real-life-among-us", "name": "Real Life Among Us", "price": 50},
    {"event_id": "survivor-drop", "name": "Survivor Drop", "price": 50},
    {"event_id": "treasure-hunt", "name": "Treasure Hunt", "price": 50},
    {"event_id": "word-wizard-english", "name": "Word Wizard", "price": 50},
    {"event_id": "brain-booster-math", "name": "Brain Booster Math", "price": 50},
    {"event_id": "squid-game", "name": "Squid Game", "price": 50},
    {"event_id": "reel-rush", "name": "Reel Rush", "price": 50},
]

async def master_sync():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- 1. UPDATING MASTER EVENTS COLLECTION ---")
    for event in MASTER_EVENTS:
        await db.events.update_one(
            {"event_id": event["event_id"]},
            {"$set": {"name": event["name"], "price": event["price"]}},
            upsert=True
        )
    print(f"Updated {len(MASTER_EVENTS)} events in 'events' collection.")

    print("\n--- 2. RE-FLATTENING ALL REGISTRATIONS ---")
    # Clear existing flattened entries to ensure no ghosts
    await db.event_level_registrations.delete_many({})
    
    # Fetch all registrations
    regs = await db.registrations.find().to_list(5000)
    
    # Create event lookup map
    event_map = {e["event_id"]: e for e in MASTER_EVENTS}
    
    flattened_count = 0
    for r in regs:
        # Get selected events from either 'selected_events' (slugs) or 'event_details'
        selected_slugs = r.get("selected_events", [])
        if not selected_slugs and r.get("event_details"):
            # Try to map names back to slugs if slugs are missing
            # But usually slugs are better.
            pass

        for slug in selected_slugs:
            event_info = event_map.get(slug)
            if not event_info:
                # Fallback search by ID or Name if slug doesn't match
                continue
            
            flat_entry = {
                "registration_id": r.get("registration_id"),
                "full_name": r.get("full_name"),
                "enrollment_no": r.get("enrollment_no"),
                "mobile_no": r.get("mobile_no"),
                "college_name": r.get("college_name"),
                "dept": r.get("dept"),
                "sem": r.get("sem"),
                "event_id": slug,
                "event_name": event_info["name"],
                "price": event_info["price"],
                "payment_status": r.get("payment_status", "UNPAID"),
                "approved_by": r.get("approved_by"),
                "register_date": r.get("register_date"),
                "total_amount": r.get("total_amount")
            }
            await db.event_level_registrations.insert_one(flat_entry)
            flattened_count += 1

    print(f"Flattened {flattened_count} event entries across {len(regs)} registrations.")
    print("\n--- DATABASE IS NOW 100% UP TO DATE ---")
    client.close()

if __name__ == "__main__":
    asyncio.run(master_sync())
