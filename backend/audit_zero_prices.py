import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def audit_zero_prices():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- AUDIT: ZERO PRICE CHECK ---")
    
    # 1. Check Main Registrations
    # Count PAID entries with total_amount = 0
    zero_main_count = await db.registrations.count_documents({
        "payment_status": "PAID",
        "total_amount": 0
    })
    print(f"Main Registrations (PAID) with total_amount=0: {zero_main_count}")
    
    # 2. Check Flattened Entries
    # Count PAID entries with price = 0
    zero_flat_count = await db.event_level_registrations.count_documents({
        "payment_status": "PAID",
        "price": 0
    })
    print(f"Flattened Entries (PAID) with price=0: {zero_flat_count}")
    
    # 3. Sample a few to see what's wrong
    if zero_flat_count > 0:
        print("\n--- SAMPLE ZERO PRICE ENTRIES ---")
        cursor = db.event_level_registrations.find({"payment_status": "PAID", "price": 0}).limit(5)
        async for doc in cursor:
            print(f"User: {doc.get('full_name')} | Event: {doc.get('event_id')} | Price: {doc.get('price')}")
            
    client.close()

if __name__ == "__main__":
    asyncio.run(audit_zero_prices())
