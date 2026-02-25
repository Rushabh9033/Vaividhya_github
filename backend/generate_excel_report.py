import asyncio
import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

MONGO_URL = "mongodb+srv://vaividhya2k26:vaividhya1234@cluster0.j2coack.mongodb.net/"
DB_NAME = "vaividhya_db"

async def generate_excel_report():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # 1. Fetch all PAID entries from event_level_registrations
    cursor = db.event_level_registrations.find({"payment_status": "PAID"})
    entries = await cursor.to_list(None)
    
    data = []
    start_date_limit = "2026-01-28"
    
    for e in entries:
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
            "Event": e.get("event_name") or e.get("event_id"),
            "Student Name": e.get("full_name"),
            "Enrollment No": e.get("enrollment_no"),
            "Price": e.get("price", 0)
        })

    # 2. Create DataFrame
    df = pd.DataFrame(data)
    
    # 3. Aggregate for Daily Summary
    summary_data = []
    grand_total_count = 0
    grand_total_amount = 0
    
    all_dates = sorted(df['Date'].unique())
    
    final_output_rows = []
    
    for d in all_dates:
        day_df = df[df['Date'] == d]
        event_counts = day_df.groupby('Event').size().reset_index(name='Count')
        event_counts = event_counts.sort_values(by='Count', ascending=False)
        
        for _, row in event_counts.iterrows():
            final_output_rows.append({
                "Date": d,
                "Event": row['Event'],
                "Paid Count": row['Count']
            })
            grand_total_count += row['Count']
            
        day_total = event_counts['Count'].sum()
        final_output_rows.append({
            "Date": f"TOTAL for {d}",
            "Event": "---",
            "Paid Count": day_total
        })
        final_output_rows.append({}) # Empty row for spacing
        
    final_output_rows.append({
        "Date": "GRAND TOTAL",
        "Event": "---",
        "Paid Count": grand_total_count
    })

    # 4. Save to Excel
    final_df = pd.DataFrame(final_output_rows)
    output_file = "Daily_Paid_Entries_Report.xlsx"
    
    # We'll use ExcelWriter to make it look nicer
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        final_df.to_excel(writer, index=False, sheet_name='Daily Breakdown')
        
        # Also include a detailed sheet with every student record
        df_details = df.sort_values(by=['Date', 'Event'])
        df_details.to_excel(writer, index=False, sheet_name='Detailed Records')
        
        # Access the worksheet to adjust column widths
        workbook = writer.book
        for sheet_name in writer.sheets:
            worksheet = writer.sheets[sheet_name]
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

    print(f"Excel report generated: {os.path.abspath(output_file)}")
    client.close()

if __name__ == "__main__":
    asyncio.run(generate_excel_report())
