import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def generate_daily_report():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Range: 2026-01-28 to Today
    start_date = "2026-01-28"
    
    # We use event_level_registrations for accurate event-by-event counts
    cursor = db.event_level_registrations.find({"payment_status": "PAID"})
    entries = await cursor.to_list(None)
    
    report = {} # date -> {event -> count}
    
    for e in entries:
        raw_date = e.get("approved_at") or e.get("register_date")
        if not raw_date:
            continue
            
        try:
            if "T" in str(raw_date):
                # ISO format
                dt_obj = datetime.fromisoformat(str(raw_date).replace("Z", "+00:00"))
                date_str = dt_obj.strftime("%Y-%m-%d")
            elif "/" in str(raw_date):
                # Handle DD/MM/YYYY or MM/DD/YYYY - assuming standard for this app
                parts = str(raw_date).split()[0].split("/")
                if len(parts[0]) == 4: # YYYY/MM/DD
                    date_str = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
                else: # DD/MM/YYYY
                    date_str = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
            else:
                date_str = str(raw_date)[:10] 
        except:
            date_str = "Legacy/Misc"
            
        if date_str < start_date and date_str != "Legacy/Misc":
            continue
            
        if date_str not in report:
            report[date_str] = {}
        
        event_name = e.get("event_name") or e.get("event_id")
        report[date_str][event_name] = report[date_str].get(event_name, 0) + 1

    sorted_dates = sorted(report.keys())
    
    output_lines = []
    output_lines.append("DAILY PAID ENTRY REPORT (Jan 28 - Today)")
    output_lines.append("=" * 60)
    output_lines.append(f"{'Date':<15} | {'Event Name':<40} | {'Count':<5}")
    output_lines.append("-" * 65)
    
    grand_total = 0
    for date in sorted_dates:
        events = sorted(report[date].items(), key=lambda x: x[1], reverse=True)
        date_total = 0
        for i, (ev, count) in enumerate(events):
            display_date = date if i == 0 else ""
            output_lines.append(f"{display_date:<15} | {ev[:40]:<40} | {count:<5}")
            date_total += count
            grand_total += count
        output_lines.append(f"{' ':<15} | {'Subtotal for ' + date:<40} | {date_total:<5}")
        output_lines.append("-" * 65)
        
    output_lines.append(f"\nGRAND TOTAL PAID ENTRIES: {grand_total}")
    output_lines.append("=" * 60)
    
    output_file = "daily_paid_report.txt"
    with open(output_file, "w") as f:
        f.write("\n".join(output_lines))
        
    print(f"Report generated successfully: {os.path.abspath(output_file)}")
    client.close()

if __name__ == "__main__":
    asyncio.run(generate_daily_report())
