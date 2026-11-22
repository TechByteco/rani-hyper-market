import sqlite3

db_path = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

for tbl in ['StockPostings', 'TransProducts', 'TransInventories', 'Transactions', 'ProductVariantStocks', 'ProductVariants', 'Products']:
    cur.execute(f"PRAGMA table_info({tbl});")
    cols = [(r[1], r[2]) for r in cur.fetchall()]
    print(f"\nColumns in {tbl}:")
    for cname, ctype in cols:
        print(f"  {cname} ({ctype})")
    
    cur.execute(f"SELECT * FROM {tbl} LIMIT 2;")
    rows = cur.fetchall()
    print("  Sample row:")
    if rows:
        print(" ", dict(zip([c[0] for c in cols], rows[0])))

conn.close()
