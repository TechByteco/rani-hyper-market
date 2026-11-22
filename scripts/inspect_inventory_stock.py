import sqlite3
import datetime

db = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db)
cur = conn.cursor()

# Check total products and variants
cnt_p = cur.execute("SELECT COUNT(*) FROM Products WHERE IsActive = 1").fetchone()[0]
cnt_pv = cur.execute("SELECT COUNT(*) FROM ProductVariants").fetchone()[0]
print(f"Active Products: {cnt_p} | ProductVariants: {cnt_pv}")

# Check columns of ProductVariants
pv_cols = [c[1] for c in cur.execute("PRAGMA table_info(ProductVariants)").fetchall()]
print("ProductVariants columns:", pv_cols)

# Check StockPostings or TransProducts
tp_cols = [c[1] for c in cur.execute("PRAGMA table_info(TransProducts)").fetchall()]
print("TransProducts columns:", tp_cols)

# Check how current stock is calculated or if Stock column exists
try:
    stock_col = 'Stock' in pv_cols or 'CurrentStock' in pv_cols or 'OpStock' in pv_cols
    print("Direct stock column in ProductVariants:", [c for c in pv_cols if 'stock' in c.lower()])
except Exception as e:
    print(e)

conn.close()
