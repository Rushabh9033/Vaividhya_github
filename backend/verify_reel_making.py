import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # Searching for Reel Making entries (using regex for flexibility)
    query = {
        "event_name": {"$regex": "Reel", "$options": "i"}
    }
    
    results = await db.event_level_registrations.find(query).to_list(1000)
    
    print(f"--- REEL MAKING ENTRIES FOUND: {len(results)} ---")
    for r in results:
        print(f"Name: {r.get('full_name')} | Enrollment: {r.get('enrollment_no')} | Status: {r.get('payment_status')} | ApprovedBy: {r.get('approved_by')}")

if __name__ == "__main__":
    asyncio.run(main())
