import sqlite3, glob, os
from collections import defaultdict

dbs = glob.glob(r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\*_20*.db')

# Map VariantId to Product Name in 2026-2027
db_2026 = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn_2026 = sqlite3.connect(db_2026)
cur_2026 = conn_2026.cursor()

cur_2026.execute("""
    SELECT pv.Id, p.Name, pv.Mrp, pv.SalesRate, pv.PurchaseRate, pvs.Stock
    FROM ProductVariants pv
    JOIN Products p ON pv.ProductId = p.Id
    LEFT JOIN ProductVariantStocks pvs ON pv.Id = pvs.VariantId
""")
product_map = {}
for vid, name, mrp, srate, prate, cur_stk in cur_2026.fetchall():
    product_map[vid] = {
        'name': name.strip() if name else f'Product-{vid}',
        'mrp': mrp or 0,
        'sales_rate': srate or 0,
        'purchase_rate': prate or 0,
        'current_db_stock': cur_stk if cur_stk is not None else 0
    }
conn_2026.close()

print(f"Loaded {len(product_map)} active variants from 2026-2027 DB.")

# Track exits per year
exits_by_year = defaultdict(lambda: defaultdict(float))
total_exits = defaultdict(float)
total_inward = defaultdict(float)

for db_path in sorted(dbs):
    year = os.path.basename(db_path).split('_')[-1].replace('.db', '')
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("""
        SELECT VariantId,
               SUM(CASE WHEN Quantity < 0 THEN ABS(Quantity) ELSE 0 END) as qty_out,
               SUM(CASE WHEN Quantity > 0 THEN Quantity ELSE 0 END) as qty_in
        FROM StockPostings
        GROUP BY VariantId
    """)
    for vid, q_out, q_in in cur.fetchall():
        exits_by_year[year][vid] += q_out
        total_exits[vid] += q_out
        total_inward[vid] += q_in
    conn.close()

# Sort top moving products
top_movers = sorted(total_exits.items(), key=lambda x: x[1], reverse=True)
print(f"\nTotal products with billing exits in 5 years: {len(total_exits)}")
print("\nTop 25 High-Velocity Products across 5 Years:")
print(f"{'VariantId':<10} | {'Name':<35} | {'5-Yr Sold':<10} | {'5-Yr Inward':<12} | {'Current DB Stock':<16} | {'Avg Monthly':<12}")
print("-" * 110)

for vid, sold in top_movers[:25]:
    info = product_map.get(vid, {'name': f'Variant-{vid}', 'current_db_stock': 0})
    inward = total_inward.get(vid, 0)
    avg_m = sold / 60.0  # 5 years = 60 months
    print(f"{vid:<10} | {info['name'][:35]:<35} | {sold:<10,.1f} | {inward:<12,.1f} | {info['current_db_stock']:<16.1f} | {avg_m:<12,.1f}")
