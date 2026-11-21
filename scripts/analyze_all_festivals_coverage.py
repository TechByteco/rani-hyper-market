import json, os, sqlite3, subprocess

# 1. Load ALL_YEAR_FESTIVALS from festivalMasterData.js
cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS));']
out = subprocess.check_output(cmd, encoding='utf-8')
festivals = json.loads(out.strip())

db_files = {
    '2022-2023': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/51cd71bd-6eed-4502-8d0c-ad8a42436fd6_2022-2023.db',
    '2023-2024': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db',
    '2024-2025': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db',
    '2025-2026': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
    '2026-2027': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
}

def get_db_for_date(date_str):
    if not date_str or len(date_str) < 10:
        return None
    try:
        yr = int(date_str[:4])
        mo = int(date_str[5:7])
        fy = f'{yr}-{yr+1}' if mo >= 4 else f'{yr-1}-{yr}'
        return db_files.get(fy)
    except:
        return None

print(f"Total festivals in master: {len(festivals)}")

coverage_report = []

for f in festivals:
    fid = f['id']
    fname = f['name']
    dby = f.get('datesByYear', {})
    
    # Check date availability per year
    years_found = {}
    for yr in ['2022', '2023', '2024', '2025', '2026', '2027']:
        ydata = dby.get(yr)
        if ydata:
            dt = ydata.get('date') if isinstance(ydata, dict) else ydata
            win = ydata.get('window') if isinstance(ydata, dict) else None
            cutoff = ydata.get('cutoff') if isinstance(ydata, dict) else None
            
            # test DB query
            db_path = get_db_for_date(dt)
            tx_count = 0
            if db_path and os.path.exists(db_path) and dt:
                try:
                    conn = sqlite3.connect(db_path)
                    c = conn.cursor()
                    c.execute("SELECT count(*) FROM Transactions WHERE VouType=27 AND VoucherDate=?", (dt,))
                    tx_count = c.fetchone()[0]
                    conn.close()
                except Exception as e:
                    tx_count = -1
            years_found[yr] = {'date': dt, 'cutoff': cutoff, 'has_win': bool(win), 'tx': tx_count}
        else:
            years_found[yr] = None
            
    coverage_report.append({
        'id': fid,
        'name': fname,
        'years': years_found
    })

print(f"{'#':<3} {'Festival ID':<28} {'2023':<12} {'2024':<12} {'2025':<12} {'2026 (Fest)':<12} {'2026 (Cutoff)':<14} {'2027':<12}")
print("-" * 105)
for i, r in enumerate(coverage_report):
    y23 = r['years'].get('2023', {})
    y24 = r['years'].get('2024', {})
    y25 = r['years'].get('2025', {})
    y26 = r['years'].get('2026', {})
    y27 = r['years'].get('2027', {})
    
    d23 = (y23['date'] if y23 else 'MISSING')[:10]
    d24 = (y24['date'] if y24 else 'MISSING')[:10]
    d25 = (y25['date'] if y25 else 'MISSING')[:10]
    d26 = (y26['date'] if y26 else 'MISSING')[:10]
    c26 = (y26['cutoff'] if y26 and y26.get('cutoff') else 'MISSING')[:14]
    d27 = (y27['date'] if y27 else 'MISSING')[:10]
    
    print(f"{i+1:<3} {r['id']:<28} {d23:<12} {d24:<12} {d25:<12} {d26:<12} {c26:<14} {d27:<12}")
