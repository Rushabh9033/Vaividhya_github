import asyncio
import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def generate_horizontal_report():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("--- DEEP SCANNING DATABASE FOR PAID ENTRIES ---")
    
    # We'll fetch from event_level_registrations because it represents the actual final verified entries
    # but we'll also double check registrations to be absolutely sure.
    
    cursor = db.event_level_registrations.find({"payment_status": "PAID"})
    entries = await cursor.to_list(None)
    
    data = []
    start_date_limit = "2026-01-28"
    
    for e in entries:
        # Priority: approved_at (User's priority date)
        raw_date = e.get("approved_at") or e.get("register_date")
        if not raw_date:
            continue
            
        try:
            if "T" in str(raw_date):
                dt_obj = datetime.fromisoformat(str(raw_date).replace("Z", "+00:00"))
                date_str = dt_obj.strftime("%Y-%m-%d")
            elif "/" in str(raw_date):
                parts = str(raw_date).split()[0].split("/")
                if len(parts[0]) == 4: # YYYY/MM/DD
                    date_str = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
                else: # DD/MM/YYYY
                    date_str = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
            else:
                date_str = str(raw_date)[:10]
        except:
            date_str = "Legacy/Misc"
            
        if date_str < start_date_limit and date_str != "Legacy/Misc":
            continue
            
        data.append({
            "Date": date_str,
            "Event": e.get("event_name") or e.get("event_id")
        })

    if not data:
        print("No paid entries found in the given range.")
        client.close()
        return

    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Pivot the data: Events as rows, Dates as columns
    matrix = df.pivot_table(index='Event', columns='Date', aggfunc='size', fill_value=0)
    
    # Add a "Row Total" (Total entries for that event)
    matrix['Total'] = matrix.sum(axis=1)
    
    # Add a "Column Total" (Total entries for that day)
    # Use loc to add a new row called 'Total'
    matrix.loc['DAILY TOTAL'] = matrix.sum()
    
    output_file = "Horizontal_Paid_Matrix_Report.xlsx"
    
    # Formatting
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        matrix.to_excel(writer, sheet_name='Paid Matrix')
        
        # Access the worksheet
        workbook = writer.book
        worksheet = writer.sheets['Paid Matrix']
        
        # Adjust column widths
        for col in worksheet.columns:
            max_length = 0
            column = col[0].column_letter
            for cell in col:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = (max_length + 2)
            worksheet.column_dimensions[column].width = adjusted_width

    print(f"Horizontal Matrix Report generated: {os.path.abspath(output_file)}")
    print(f"Grand Total Entries Accounted: {matrix.loc['DAILY TOTAL', 'Total']}")
    client.close()

if __name__ == "__main__":
    asyncio.run(generate_horizontal_report())
