import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # Check if event exists in master list
    event = await db.events.find_one({"$or": [{"event_id": "reel-rush"}, {"event_name": {"$regex": "Reel Rush", "$options": "i"}}]})
    print(f"DB Event in 'events' collection: {event}")
    
    # Check for registrations
    regs_slug = await db.registrations.find({"selected_events": "reel-rush"}).to_list(100)
    print(f"Registrations found with slug 'reel-rush': {len(regs_slug)}")
    
    regs_name = await db.registrations.find({"event_details.event_name": {"$regex": "Reel Rush", "$options": "i"}}).to_list(100)
    print(f"Registrations found with name including 'Reel Rush': {len(regs_name)}")
    
    # Check flattened table
    flat_regs = await db.event_level_registrations.find({"event_name": {"$regex": "Reel Rush", "$options": "i"}}).to_list(100)
    print(f"Flattened registrations found for 'Reel Rush': {len(flat_regs)}")

if __name__ == "__main__":
    asyncio.run(main())
