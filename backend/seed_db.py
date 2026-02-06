import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Hardcoded for now as I saw in database.py
MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"

client = AsyncIOMotorClient(MONGO_URL)
db = client.vaividhya_db  # FIXED: was vividhya_db
events_collection = db.events

# Data derived from eventsData.js
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
  {"slug": "adrena", "name": "ADRENA", "category": "Technical", "fee": 50},
  {"slug": "ai-hunting", "name": "AI HUNTING", "category": "Technical", "fee": 50},
  {"slug": "ai-prompt-battle", "name": "AI PROMPT BATTLE", "category": "Technical", "fee": 50},
  {"slug": "biz-brain-challenge", "name": "BIZ BRAIN CHALLENGE", "category": "Technical", "fee": 50},
  {"slug": "blind-code", "name": "BLIND CODE", "category": "Technical", "fee": 50},
  {"slug": "break-the-bot", "name": "BREAK THE BOT", "category": "Technical", "fee": 50},
  {"slug": "bridge-battle", "name": "BRIDGE BATTLE", "category": "Technical", "fee": 100},
  {"slug": "drone-dash", "name": "DRONE DASH", "category": "Technical", "fee": 100},
  {"slug": "escape-room", "name": "ESCAPE ROOM", "category": "Technical", "fee": 50},
  {"slug": "logo-hunt", "name": "LOGO HUNT", "category": "Technical", "fee": 50},
  {"slug": "puzzle-hunt", "name": "PUZZLE HUNT", "category": "Technical", "fee": 50},
  {"slug": "real-life-among-us", "name": "REAL LIFE AMONG US", "category": "Technical", "fee": 50},
  {"slug": "reverse-coding", "name": "REVERSE CODING", "category": "Technical", "fee": 50},
  {"slug": "robo-football-clash", "name": "ROBO FOOTBALL CLASH", "category": "Technical", "fee": 100},
  {"slug": "robo-war-pro", "name": "ROBO WAR PRO", "category": "Technical", "fee": 100},
  {"slug": "web-treasure-hunting", "name": "WEB TREASURE HUNTING", "category": "Technical", "fee": 0},
  {"slug": "bgmi", "name": "BGMI", "category": "Non-Technical", "fee": 50},
  {"slug": "bull-vs-bear", "name": "BULL VS BEAR", "category": "Non-Technical", "fee": 50},
  {"slug": "dream-to-deal", "name": "DREAM TO DEAL", "category": "Non-Technical", "fee": 50},
  {"slug": "free-fire-pro", "name": "FREE FIRE PRO", "category": "Non-Technical", "fee": 50},
  {"slug": "ludo-king", "name": "LUDO KING", "category": "Non-Technical", "fee": 50},
  {"slug": "mini-musti-for-1-min", "name": "MINI MUSTI FOR 1 MIN", "category": "Non-Technical", "fee": 50},
  {"slug": "mystic-mover", "name": "MYSTIC MOVER", "category": "Non-Technical", "fee": 50},
  {"slug": "spin-mania", "name": "SPIN MANIA", "category": "Non-Technical", "fee": 50},
  {"slug": "squid-game", "name": "SQUID GAME IN TECH WORLD", "category": "Non-Technical", "fee": 50},
  {"slug": "autonomous-robotics-workshop", "name": "Autonomous Robotics Workshop", "category": "Technical", "fee": 2000},
  {"slug": "robotics-challenge", "name": "Robotics Challenge", "category": "Technical", "fee": 150},
]

async def seed():
    print("Clearing events...")
    await events_collection.delete_many({})
    
    print("Seeding events...")
    for e in events_data:
        # User Model: event_id: str, event_name: str, price: int, category: str
        doc = {
            "event_id": e["slug"],  # USING SLUG AS ID for frontend image mapping
            "event_name": e["name"],
            "price": e["fee"],
            "category": e["category"]
        }
        await events_collection.insert_one(doc)
    
    print("Done!")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())
