import sqlite3, glob, time

db_files = glob.glob('data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/*.db')
print(f"Adding index to {len(db_files)} databases...")

for db in db_files:
    t0 = time.time()
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute("CREATE INDEX IF NOT EXISTS idx_trans_voutype_vdate ON Transactions(VouType, VoucherDate);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_trans_prod_transid ON TransProducts(TransId);")
    conn.commit()
    conn.close()
    print(f" Indexed {db} in {time.time()-t0:.2f}s")

print("All databases successfully indexed!")
