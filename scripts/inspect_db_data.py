import sqlite3, os

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get table names
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cur.fetchall()]
print('Tables in active 2026-2027 DB:', tables)

# Check counts
for t in ['Sales', 'SalesDetails', 'Products', 'ProductVariants', 'ProductVariantStocks', 'StockPostings']:
    if t in tables:
        cur.execute(f"SELECT COUNT(*) FROM {t}")
        cnt = cur.fetchone()[0]
        print(f"  {t}: {cnt:,} rows")

# Also check Sales vouchers
if 'Sales' in tables:
    cur.execute("SELECT COUNT(DISTINCT TransId), COUNT(DISTINCT VoucherNo) FROM Sales")
    row = cur.fetchone()
    print(f"  Unique TransIds in Sales: {row[0]:,}, Unique VoucherNos: {row[1]:,}")

# Also check other DBs if needed
for f in os.listdir('data/database/37a64e83-514d-4b00-b90a-9af172dacdd6'):
    if f.endswith('.db') and f != os.path.basename(db_path):
        c = sqlite3.connect(os.path.join('data/database/37a64e83-514d-4b00-b90a-9af172dacdd6', f))
        cur2 = c.cursor()
        try:
            cur2.execute("SELECT COUNT(*) FROM Sales")
            sc = cur2.fetchone()[0]
            cur2.execute("SELECT COUNT(*) FROM Products")
            pc = cur2.fetchone()[0]
            print(f"DB {f[-12:]}: Sales={sc:,}, Products={pc:,}")
        except Exception as e:
            print(f"DB {f}: {e}")
        c.close()
conn.close()
