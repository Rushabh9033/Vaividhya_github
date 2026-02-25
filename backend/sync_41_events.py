import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def sync_master_events():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # 41 Events based on frontend data
    events_to_sync = [
        {"event_id": "ai-shape-cipher", "event_name": "AI Shape Cipher", "category": "Technical", "price": 50},
        {"event_id": "ai-quiz", "event_name": "AI Quiz", "category": "Technical", "price": 50},
        {"event_id": "brain-booster-math", "event_name": "Brain Booster Math", "category": "Technical", "price": 50},
        {"event_id": "case-catalyst", "event_name": "Case Catalyst", "category": "Technical", "price": 50},
        {"event_id": "cricket-carnival", "event_name": "Cricket Carnival", "category": "Non-Technical", "price": 50},
        {"event_id": "fold-and-build", "event_name": "Fold & Build", "category": "Technical", "price": 50},
        {"event_id": "quantum-quest-physics", "event_name": "Quantum Quest Physics", "category": "Technical", "price": 50},
        {"event_id": "robo-mind-matrix", "event_name": "Robo Mind Matrix", "category": "Technical", "price": 50},
        {"event_id": "robo-rush", "event_name": "Robo Rush", "category": "Technical", "price": 100},
        {"event_id": "survivor-drop", "event_name": "Survivor Drop", "category": "Non-Technical", "price": 50},
        {"event_id": "the-chemical-detective", "event_name": "The Chemical Detective", "category": "Technical", "price": 50},
        {"event_id": "treasure-hunt", "event_name": "Treasure Hunt", "category": "Non-Technical", "price": 50},
        {"event_id": "word-wizard-english", "event_name": "Word Wizard English", "category": "Non-Technical", "price": 50},
        {"event_id": "adrena", "event_name": "Ad Arena", "category": "Technical", "price": 50},
        {"event_id": "ai-hunting", "event_name": "AI Hunting", "category": "Technical", "price": 50},
        {"event_id": "ai-prompt-battle", "event_name": "AI Prompt Battle", "category": "Technical", "price": 50},
        {"event_id": "biz-brain-challenge", "event_name": "Biz Brain Challenge", "category": "Technical", "price": 50},
        {"event_id": "blind-code", "event_name": "Blind Code", "category": "Technical", "price": 50},
        {"event_id": "break-the-bot", "event_name": "Break The Bot", "category": "Technical", "price": 50},
        {"event_id": "bridge-battle", "event_name": "Bridge Battle", "category": "Technical", "price": 100},
        {"event_id": "drone-dash", "event_name": "Drone Dash", "category": "Technical", "price": 100},
        {"event_id": "escape-room", "event_name": "Escape Room", "category": "Technical", "price": 50},
        {"event_id": "logo-hunt", "event_name": "Logo Hunt", "category": "Technical", "price": 50},
        {"event_id": "puzzle-hunt", "event_name": "Puzzle Hunt", "category": "Technical", "price": 50},
        {"event_id": "real-life-among-us", "event_name": "Real Life Among Us", "category": "Technical", "price": 50},
        {"event_id": "reverse-coding", "event_name": "Reverse Coding", "category": "Technical", "price": 50},
        {"event_id": "robo-football-clash", "event_name": "Robo Football Clash", "category": "Technical", "price": 100},
        {"event_id": "robo-war-pro", "event_name": "ROBO WAR PRO", "category": "Technical", "price": 100},
        {"event_id": "squid-game", "event_name": "Squid Game: In Tech World", "category": "Technical", "price": 50},
        {"event_id": "web-treasure-hunting", "event_name": "Web Treasure Hunting", "category": "Technical", "price": 0},
        {"event_id": "bgmi", "event_name": "BGMI", "category": "Non-Technical", "price": 50},
        {"event_id": "bull-vs-bear", "event_name": "Bull Vs Bear", "category": "Non-Technical", "price": 50},
        {"event_id": "dream-to-deal", "event_name": "Dream to Deal", "category": "Non-Technical", "price": 50},
        {"event_id": "free-fire-pro", "event_name": "Free Fire Pro", "category": "Non-Technical", "price": 50},
        {"event_id": "ludo-king", "event_name": "Ludo King", "category": "Non-Technical", "price": 50},
        {"event_id": "mini-musti-for-1-min", "event_name": "Mini Musti For 1 Min", "category": "Non-Technical", "price": 50},
        {"event_id": "mystic-mover", "event_name": "Mystic Mover", "category": "Non-Technical", "price": 50},
        {"event_id": "spin-mania", "event_name": "Spin Mania", "category": "Non-Technical", "price": 50},
        {"event_id": "autonomous-robotics-workshop", "event_name": "Autonomous Robotics Workshop", "category": "Technical", "price": 2000},
        {"event_id": "robotics-challenge", "event_name": "Robotics Challenge", "category": "Technical", "price": 150},
        {"event_id": "reel-rush", "event_name": "Reel Rush", "category": "Non-Technical", "price": 50}
    ]
    
    # Clean and Re-insert to ensure perfect sync
    await db.events.delete_many({})
    await db.events.insert_many(events_to_sync)
    print(f"SUCCESS: Synced {len(events_to_sync)} events in master table.")

if __name__ == "__main__":
    asyncio.run(sync_master_events())
