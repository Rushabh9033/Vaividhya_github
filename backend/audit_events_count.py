import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def audit_events():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # 41 Events as defined in the frontend
    expected_slugs = [
        "ai-shape-cipher", "ai-quiz", "brain-booster-math", "case-catalyst", "cricket-carnival",
        "fold-and-build", "quantum-quest-physics", "robo-mind-matrix", "robo-rush", "survivor-drop",
        "the-chemical-detective", "treasure-hunt", "word-wizard-english", "adrena", "ai-hunting",
        "ai-prompt-battle", "biz-brain-challenge", "blind-code", "break-the-bot", "bridge-battle",
        "drone-dash", "escape-room", "logo-hunt", "puzzle-hunt", "real-life-among-us",
        "reverse-coding", "robo-football-clash", "robo-war-pro", "web-treasure-hunting", "bgmi",
        "bull-vs-bear", "dream-to-deal", "free-fire-pro", "ludo-king", "mini-musti-for-1-min",
        "mystic-mover", "spin-mania", "autonomous-robotics-workshop", "robotics-challenge",
        "reel-rush", "web-treasure-hunt" # Checking for potential duplicates or split names
    ]
    
    db_events = await db.events.find().to_list(100)
    db_slugs = {e.get('event_id') for e in db_events}
    
    print(f"Total events in DB: {len(db_events)}")
    
    missing = [s for s in expected_slugs if s not in db_slugs]
    print(f"Missing slugs: {missing}")
    
    # If missing found, we could add them here or report
    # The user said "add also in events table" implying ensure all are there.

if __name__ == "__main__":
    asyncio.run(audit_events())
