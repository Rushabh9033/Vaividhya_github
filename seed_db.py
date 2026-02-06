import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Hardcoded for now as I saw in database.py
MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"

client = AsyncIOMotorClient(MONGO_URL)
db = client.vaividhya_db
events_collection = db.events
stats_collection = db.events_stats

# Data derived from eventsData.js (40 Total Events)
events_data = [
  {"slug": "ai-shape-cipher", "name": "AI Shape Cipher", "category": "Technical", "fee": 50},
  {"slug": "ai-quiz", "name": "AI Quiz", "category": "Technical", "fee": 50},
  {"slug": "brain-booster-math", "name": "Brain Booster Math", "category": "Technical", "fee": 50},
  {"slug": "case-catalyst", "name": "Case Catalyst", "category": "Technical", "fee": 50},
  {"slug": "cricket-carnival", "name": "Cricket Carnival", "category": "Non-Technical", "fee": 50},
  {"slug": "fold-and-build", "name": "Fold & Build", "category": "Technical", "fee": 50},
  {"slug": "quantum-quest-physics", "name": "Quantum Quest Physics", "category": "Technical", "fee": 50},
  {"slug": "robo-mind-matrix", "name": "Robo Mind Matrix", "category": "Technical", "fee": 50},
  {"slug": "robo-rush", "name": "Robo Rush", "category": "Technical", "fee": 100},
  {"slug": "survivor-drop", "name": "Survivor Drop", "category": "Non-Technical", "fee": 50},
  {"slug": "the-chemical-detective", "name": "The Chemical Detective", "category": "Technical", "fee": 50},
  {"slug": "treasure-hunt", "name": "Treasure Hunt", "category": "Non-Technical", "fee": 50},
  {"slug": "word-wizard-english", "name": "Word Wizard English", "category": "Non-Technical", "fee": 50},
  {"slug": "adrena", "name": "Ad Arena", "category": "Technical", "fee": 50},
  {"slug": "ai-hunting", "name": "AI Hunting", "category": "Technical", "fee": 50},
  {"slug": "ai-prompt-battle", "name": "AI Prompt Battle", "category": "Technical", "fee": 50},
  {"slug": "biz-brain-challenge", "name": "Biz Brain Challenge", "category": "Technical", "fee": 50},
  {"slug": "blind-code", "name": "Blind Code", "category": "Technical", "fee": 50},
  {"slug": "break-the-bot", "name": "Break The Bot", "category": "Technical", "fee": 50},
  {"slug": "bridge-battle", "name": "Bridge Battle", "category": "Technical", "fee": 100},
  {"slug": "drone-dash", "name": "Drone Dash", "category": "Technical", "fee": 100},
  {"slug": "escape-room", "name": "Escape Room", "category": "Technical", "fee": 50},
  {"slug": "logo-hunt", "name": "Logo Hunt", "category": "Technical", "fee": 50},
  {"slug": "puzzle-hunt", "name": "Puzzle Hunt", "category": "Technical", "fee": 50},
  {"slug": "real-life-among-us", "name": "Real Life Among Us", "category": "Technical", "fee": 50},
  {"slug": "reverse-coding", "name": "Reverse Coding", "category": "Technical", "fee": 50},
  {"slug": "robo-football-clash", "name": "Robo Football Clash", "category": "Technical", "fee": 100},
  {"slug": "robo-war-pro", "name": "Robo War Pro", "category": "Technical", "fee": 100},
  {"slug": "squid-game", "name": "Squid Game: In Tech World", "category": "Technical", "fee": 50},
  {"slug": "web-treasure-hunting", "name": "Web Treasure Hunting", "category": "Technical", "fee": 0},
  {"slug": "bgmi", "name": "BGMI", "category": "Non-Technical", "fee": 50},
  {"slug": "bull-vs-bear", "name": "Bull Vs Bear", "category": "Non-Technical", "fee": 50},
  {"slug": "dream-to-deal", "name": "Dream to Deal", "category": "Non-Technical", "fee": 50},
  {"slug": "free-fire-pro", "name": "Free Fire Pro", "category": "Non-Technical", "fee": 50},
  {"slug": "ludo-king", "name": "Ludo King", "category": "Non-Technical", "fee": 50},
  {"slug": "mini-musti-for-1-min", "name": "Mini Musti For 1 Min", "category": "Non-Technical", "fee": 50},
  {"slug": "mystic-mover", "name": "Mystic Mover", "category": "Non-Technical", "fee": 50},
  {"slug": "spin-mania", "name": "Spin Mania", "category": "Non-Technical", "fee": 50},
  {"slug": "autonomous-robotics-workshop", "name": "Autonomous Robotics Workshop", "category": "Technical", "fee": 2000},
  {"slug": "robotics-challenge", "name": "Robotics Challenge", "category": "Technical", "fee": 150},
]

async def seed():
    print(f"Total events to seed: {len(events_data)}")
    
    print("Clearing collections...")
    await events_collection.delete_many({})
    await stats_collection.delete_many({})
    
    print("Seeding collections...")
    for e in events_data:
        # 1. Seed Main Events Collection
        event_doc = {
            "event_id": e["slug"],
            "event_name": e["name"],
            "price": e["fee"],
            "category": e["category"]
        }
        await events_collection.insert_one(event_doc)
        
        # 2. Seed Physical Stats Collection (0 entries)
        stat_doc = {
            "event_id": e["slug"],
            "event_name": e["name"],
            "count": 0
        }
        await stats_collection.insert_one(stat_doc)
    
    print(f"Successfully seeded {len(events_data)} events and initialized stats.")

if __name__ == "__main__":
    asyncio.run(seed())
