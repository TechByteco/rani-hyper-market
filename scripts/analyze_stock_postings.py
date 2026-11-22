import sqlite3, glob, os

dbs = glob.glob(r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\*_20*.db')

print("Analyzing VouTypes and Quantity movements in StockPostings:")
for db_path in sorted(dbs):
    name = os.path.basename(db_path)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("""
        SELECT VouType, 
               COUNT(*) as rows,
               SUM(CASE WHEN Quantity > 0 THEN Quantity ELSE 0 END) as stock_in,
               SUM(CASE WHEN Quantity < 0 THEN Quantity ELSE 0 END) as stock_out,
               SUM(Quantity) as net_movement
        FROM StockPostings
        GROUP BY VouType
    """)
    rows = cur.fetchall()
    print(f"\n--- {name} ---")
    for vt, cnt, sin, sout, net in rows:
        print(f"  VouType {vt}: {cnt} rows | Stock IN: +{sin:,.1f} | Stock OUT: {sout:,.1f} | Net: {net:,.1f}")
    conn.close()
