import sqlite3, glob, os

dbs = glob.glob(r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\*_20*.db')
print("Found databases:", len(dbs))

for db_path in sorted(dbs):
    name = os.path.basename(db_path)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cur.fetchall()]
    print(f"\n--- {name} ({len(tables)} tables) ---")
    
    # Check key tables: Products, Invoices, InvoiceItems, ProductVariantStocks, Purchases, etc.
    for target in ['Products', 'ProductVariants', 'ProductVariantStocks', 'Invoices', 'InvoiceItems', 'Purchases', 'PurchaseItems', 'StockMovements', 'StockAdjustments']:
        if target in tables:
            cur.execute(f"SELECT COUNT(*) FROM {target}")
            cnt = cur.fetchone()[0]
            print(f"  {target}: {cnt} rows")
        else:
            print(f"  {target}: [NOT PRESENT]")
    conn.close()
