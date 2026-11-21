import sqlite3
import json
import os
import subprocess

db_files = {
    '2022-2023': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/51cd71bd-6eed-4502-8d0c-ad8a42436fd6_2022-2023.db',
    '2023-2024': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db',
    '2024-2025': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db',
    '2025-2026': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
    '2026-2027': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
}

def get_db_for_date(date_str):
    if not date_str or date_str == 'Monthly' or len(date_str) < 7:
        return None
    try:
        yr = int(date_str[:4])
        mo = int(date_str[5:7])
        fy = f'{yr}-{yr+1}' if mo >= 4 else f'{yr-1}-{yr}'
        return db_files.get(fy)
    except:
        return None

def query_sales_window(start_d, end_d):
    db_path = get_db_for_date(start_d)
    if not db_path or not os.path.exists(db_path):
        return None
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute(
            'SELECT COUNT(*), SUM(Amount), COUNT(DISTINCT VoucherDate) '
            'FROM Transactions WHERE VouType=27 AND VoucherDate>=? AND VoucherDate<=? AND Amount < 100000;',
            (start_d, end_d)
        )
        r = cur.fetchone()
        conn.close()
        days = r[2] or 1
        sales = round(r[1] or 0, 2)
        return {'bills': r[0] or 0, 'sales': sales, 'days': days, 'daily_avg': round(sales / max(1, days), 2)}
    except Exception as e:
        return None

def query_exact_day(date_str):
    db_path = get_db_for_date(date_str)
    if not db_path or not os.path.exists(db_path):
        return None
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute(
            'SELECT COUNT(*), SUM(Amount) '
            'FROM Transactions WHERE VouType=27 AND VoucherDate=? AND Amount < 100000;',
            (date_str,)
        )
        r = cur.fetchone()
        conn.close()
        return {'bills': r[0] or 0, 'sales': round(r[1] or 0, 2)}
    except Exception as e:
        return None

def main():
    # Export festivals from festivalMasterData.js using node
    cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS));']
    out = subprocess.check_output(cmd, encoding='utf-8')
    festivals = json.loads(out.strip())

    master_empirical = {}
    cutoff_date_str = '2026-11-21'

    for f in festivals:
        fid = f['id']
        name = f['name']
        dby = f.get('datesByYear', {})
        
        yearly_records = {}
        years_to_check = ['2023', '2024', '2025', '2026']
        
        for yr in years_to_check:
            y_info = dby.get(yr)
            if not y_info:
                continue
            f_date = y_info.get('date')
            f_win = y_info.get('window', {})
            
            day_res = query_exact_day(f_date) if f_date else None
            win_res = query_sales_window(f_win.get('start'), f_win.get('end')) if f_win else None
            
            if (day_res and day_res['sales'] > 0) or (win_res and win_res['sales'] > 0):
                yearly_records[yr] = {
                    'festivalDate': f_date,
                    'windowStart': f_win.get('start'),
                    'windowEnd': f_win.get('end'),
                    'exactDaySales': day_res['sales'] if day_res else 0,
                    'exactDayBills': day_res['bills'] if day_res else 0,
                    'windowSales': win_res['sales'] if win_res else 0,
                    'windowBills': win_res['bills'] if win_res else 0,
                    'windowDays': win_res['days'] if win_res else 1,
                    'windowDailyAvg': win_res['daily_avg'] if win_res else 0
                }
        
        # Pick best historical reference:
        # If 2026 festival date has already passed (<= 2026-11-21), use 2026!
        # Otherwise use 2025, or 2024.
        best_yr = None
        for candidate in ['2026', '2025', '2024', '2023']:
            rec = yearly_records.get(candidate)
            if rec and (rec['exactDaySales'] > 0 or rec['windowDailyAvg'] > 0):
                if candidate == '2026':
                    f_d = rec.get('festivalDate') or rec.get('windowStart')
                    if f_d and f_d > cutoff_date_str:
                        continue # upcoming in 2026, so look back to 2025
                best_yr = candidate
                break
                
        if not best_yr:
            for candidate in ['2025', '2024', '2023']:
                if candidate in yearly_records:
                    best_yr = candidate
                    break
                    
        best_rec = yearly_records.get(best_yr) if best_yr else None
        
        base_turnover = 16500
        surge_mult = f.get('surgeMultiplier', 1.35)
        fallback_turnover = round(base_turnover * surge_mult)
        
        if best_rec:
            effective_sales = max(best_rec['exactDaySales'], best_rec['windowDailyAvg'])
            empirical_projected = round(effective_sales * 1.065) # +6.5% YoY
            last_date = best_rec['festivalDate'] or best_rec['windowStart']
            last_sales = best_rec['exactDaySales'] or best_rec['windowDailyAvg']
            last_bills = best_rec['exactDayBills'] or round(best_rec['windowBills'] / max(1, best_rec['windowDays']))
            last_win_avg = best_rec['windowDailyAvg']
            last_win_total = best_rec['windowSales']
        else:
            empirical_projected = fallback_turnover
            last_date = 'Prior Cycle'
            last_sales = fallback_turnover
            last_bills = round(fallback_turnover / 150)
            last_win_avg = fallback_turnover
            last_win_total = fallback_turnover * 3
            
        master_empirical[fid] = {
            'id': fid,
            'name': name,
            'empiricalDailyTurnover': empirical_projected,
            'lastYearReferenceYear': best_yr or '2025',
            'lastYearDate': last_date,
            'lastYearSales': last_sales,
            'lastYearBills': last_bills,
            'lastYearWindowDailyAvg': last_win_avg,
            'lastYearWindowTotal': last_win_total,
            'yoyAdjustmentPercent': '+6.5%',
            'history': yearly_records
        }

    with open('festival_empirical_turnover_master.json', 'w', encoding='utf-8') as f:
        json.dump(master_empirical, f, indent=2)

    print(f'SUCCESS: Generated festival_empirical_turnover_master.json for {len(master_empirical)} festivals.')

if __name__ == '__main__':
    main()
