import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def audit_data():
    client = AsyncIOMotorClient('mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/')
    db = client.vaividhya_db
    
    # 1. Check all events in masters to ensure no broken mapping
    events_list = await db.events.find({}, {"_id": 0, "event_id": 1, "event_name": 1}).to_list(100)
    event_ids = {e.get('event_id') for e in events_list}
    print(f"Master Event Count: {len(event_ids)}")
    
    # 2. Check registrations for slugs that don't exist in master
    regs = await db.registrations.find().to_list(3000)
    missing_slugs = set()
    total_paid_regs = 0
    for r in regs:
        if r.get('payment_status') == 'PAID':
            total_paid_regs += 1
        for slug in r.get('selected_events', []):
            if slug not in event_ids:
                missing_slugs.add(slug)
    
    print(f"Total Registrations: {len(regs)}")
    print(f"Total PAID Registrations: {total_paid_regs}")
    print(f"Slugs missing from master: {missing_slugs}")
    
    # 3. Audit Flattened Table (Only 'PAID' count check)
    flattened = await db.event_level_registrations.find().to_list(10000)
    paid_flattened = [f for f in flattened if f.get('payment_status') == 'PAID']
    unpaid_flattened = [f for f in flattened if f.get('payment_status') != 'PAID']
    
    print(f"\n--- FLATTENED TABLE AUDIT ---")
    print(f"Total Flattened Rows: {len(flattened)}")
    print(f"PAID Rows: {len(paid_flattened)}")
    print(f"UNPAID/PENDING Rows: {len(unpaid_flattened)}")
    
    # Verify if all PAID regs in main table have correct number of rows in flattened
    # This is complex, but we can check if there's any 'PAID' in flattened that is 'PENDING' in main
    # or vice versa.
    
    # Final check for specific user request: All entries must be proper.
    # I will repopulate the flattened table one last time but ensuring it ONLY includes PAID if that's the goal?
    # Actually, user said "proper paid only enterys in all required table". 
    # Usually "event_level_registrations" should represent the current state, but maybe they want a PAID-ONLY version.
    
if __name__ == "__main__":
    asyncio.run(audit_data())
