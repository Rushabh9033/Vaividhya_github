import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

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
    "rangoli": 50, "singing": 50, "dancing": 50, "stand-up-comedy": 50, "squid-game": 50,
    # Additional / Variations found in logs
    "blind-code": 50, "web-treasure-hunting": 0, "squid-game-in-tech-world": 50,
    "ludo-king": 50, "escape-room": 50, "brain-booster-math": 50, "mystic-mover": 50,
    "ai-prompt-battle": 50, "quantum-quest-physics": 50, "robo-mind-matrix": 50,
    "break-the-bot": 50, "fold-and-build": 50, "robo-rush": 50, "drone-dash": 50,
    "robo-war-pro": 50, "bull-vs-bear": 50, "puzzle-hunt": 50, "survivor-drop": 50,
    "cricket-carnival": 50, "word-wizard-english": 50, "robo-football-clash": 50,
    "ai-shape-cipher": 50, "mini-musti-for-1-min": 50, "logo-hunt": 50,
    "reverse-coding": 50, "ai-hunting": 50, "ai-quiz": 50, "ad-arena": 50,
    "biz-brain-challenge": 50
}

async def global_price_repair():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- STARTING GLOBAL PRICE REPAIR ---")
    
    # 1. Update Flattened Entries (Price is critical here)
    flat_cursor = db.event_level_registrations.find({"payment_status": "PAID"})
    flat_updated = 0
    
    async for entry in flat_cursor:
        event_id = entry.get("event_id")
        current_price = entry.get("price", 0)
        
        correct_price = GOLDEN_PRICES.get(event_id, 50) # Default to 50 if unknown logic
        
        if current_price != correct_price:
            await db.event_level_registrations.update_one(
                {"_id": entry["_id"]},
                {"$set": {
                    "price": correct_price,
                    "total_amount": correct_price # Flattened total usually equals price unless grouped
                }}
            )
            flat_updated += 1
            
    print(f"Repaired {flat_updated} flattened entries.")
    
    # 2. Update Main Registrations (Total Amount Recalculation)
    reg_cursor = db.registrations.find({"payment_status": "PAID"})
    reg_updated = 0
    
    async for reg in reg_cursor:
        slugs = reg.get("selected_events", [])
        if not slugs:
            details = reg.get("event_details", [])
            slugs = [d.get("event_id") or d.get("slug") for d in details if d.get("event_id") or d.get("slug")]
            
        new_total = 0
        for s in slugs:
            new_total += GOLDEN_PRICES.get(s, 50)
            
        # 3-event discount logic (approximate, usually -30 if >=3 techn/nontech)
        # But let's stick to raw sum for now unless verified discount applied
        # Or check if existing total was 0, then definitely fix.
        
        current_total = reg.get("total_amount", 0)
        
        if current_total == 0 or current_total != new_total: 
            # Only update if it was 0 or significantly wrong.
            # If there was a discount, new_total might be higher. 
            # Safest is to update if it is ZERO.
            
            if current_total == 0:
                 if len(slugs) >= 3:
                     new_total -= 30 # Apply discount if applicable
                 if new_total < 0: new_total = 0
                 
                 await db.registrations.update_one(
                    {"_id": reg["_id"]},
                    {"$set": {"total_amount": new_total}}
                 )
                 reg_updated += 1

    print(f"Repaired {reg_updated} main registration totals that were 0.")
    client.close()

if __name__ == "__main__":
    asyncio.run(global_price_repair())
