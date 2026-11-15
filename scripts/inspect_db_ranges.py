import sqlite3, glob, os

db_dir = "data/database/37a64e83-514d-4b00-b90a-9af172dacdd6"
dbs = glob.glob(f"{db_dir}/*.db")
print("Found databases:", dbs)

for db_path in sorted(dbs):
    print("\n--- DB:", os.path.basename(db_path))
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cur.fetchall()]
    print("Tables:", tables[:10])
    
    # Check date range in Transactions
    if "Transactions" in tables:
        cur.execute("SELECT min(VoucherDate), max(VoucherDate), count(*) FROM Transactions WHERE VouType=27")
        row = cur.fetchone()
        print(f"Retail Sales (VouType=27): Min Date={row[0]}, Max Date={row[1]}, Total Invoices={row[2]}")
    conn.close()
