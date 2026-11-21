import sqlite3, json, os

db_files = {
    '2022-2023': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/51cd71bd-6eed-4502-8d0c-ad8a42436fd6_2022-2023.db',
    '2023-2024': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db',
    '2024-2025': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db',
    '2025-2026': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/92c79395-c73b-4280-90f9-dfa651b3de01_2025-2026.db',
    '2026-2027': 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
}

def get_db_for_date(date_str):
    yr = int(date_str[:4])
    mo = int(date_str[5:7])
    fy = f'{yr}-{yr+1}' if mo >= 4 else f'{yr-1}-{yr}'
    return db_files.get(fy)

test_festivals = [
    {'name': 'Maha Shivaratri', 'start': '2024-03-06', 'end': '2024-03-09'},
    {'name': 'Thai Poosam', 'start': '2024-01-23', 'end': '2024-01-26'},
    {'name': 'Chithirai Thiruvizha', 'start': '2024-04-18', 'end': '2024-04-22'},
    {'name': 'Navaratri Sundal Days', 'start': '2024-10-02', 'end': '2024-10-11'},
    {'name': 'Christmas Grand Week', 'start': '2024-12-22', 'end': '2024-12-26'}
]

for tf in test_festivals:
    db = get_db_for_date(tf['start'])
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute("""
        SELECT count(distinct t.Id), coalesce(round(sum(t.Amount), 2), 0)
        FROM Transactions t
        WHERE t.VouType = 27 AND t.VoucherDate >= ? AND t.VoucherDate <= ?
    """, (tf['start'], tf['end']))
    bills, turnover = cur.fetchone()
    
    cur.execute("""
        SELECT p.Name, round(sum(tp.Quantity), 1) as qty, round(sum(tp.NetValue), 2) as rev
        FROM TransProducts tp
        JOIN Transactions t ON tp.TransId = t.Id
        JOIN ProductVariants pv ON tp.VariantId = pv.Id
        JOIN Products p ON pv.ProductId = p.Id
        WHERE t.VouType = 27 AND t.VoucherDate >= ? AND t.VoucherDate <= ? AND tp.Quantity < 5000
        GROUP BY p.Name
        ORDER BY rev DESC
        LIMIT 5
    """, (tf['start'], tf['end']))
    top_p = cur.fetchall()
    conn.close()
    
    print(f"\n=== {tf['name']} ({tf['start']} to {tf['end']}) ===")
    print(f"Bills: {bills}, Turnover: ₹{turnover}")
    print("Top 5 products by revenue:")
    for p in top_p:
        print(f"  - {p[0]}: Qty {p[1]}, Rev ₹{p[2]}")
