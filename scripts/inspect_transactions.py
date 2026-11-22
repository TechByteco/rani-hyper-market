import sqlite3

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

for t in ['Transactions', 'TransVouchers', 'TransProducts', 'Products', 'ProductVariants', 'ProductVariantStocks']:
    cur.execute(f"SELECT COUNT(*) FROM {t}")
    cnt = cur.fetchone()[0]
    print(f"{t}: {cnt:,} rows")

cur.execute("PRAGMA table_info(Transactions);")
print('\nTransactions columns:', [row[1] for row in cur.fetchall()])

cur.execute("PRAGMA table_info(TransVouchers);")
print('\nTransVouchers columns:', [row[1] for row in cur.fetchall()])

cur.execute("PRAGMA table_info(TransProducts);")
print('\nTransProducts columns:', [row[1] for row in cur.fetchall()])

cur.execute("SELECT VoucherType, COUNT(*) FROM TransVouchers GROUP BY VoucherType;")
print('\nVoucher Types in TransVouchers:', cur.fetchall())

conn.close()
