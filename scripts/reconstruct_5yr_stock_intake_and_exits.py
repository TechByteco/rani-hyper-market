import sqlite3, glob, os, json
from collections import defaultdict

dbs = glob.glob(r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\*_20*.db')
active_db = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'

print(f"Reading active products from {os.path.basename(active_db)}...")
conn = sqlite3.connect(active_db)
cur = conn.cursor()

cur.execute("""
    SELECT pv.Id, p.Id, p.Name, pv.Mrp, pv.SalesRate, pv.PurchaseRate, pvs.Stock, p.CategoryId
    FROM ProductVariants pv
    JOIN Products p ON pv.ProductId = p.Id
    LEFT JOIN ProductVariantStocks pvs ON pv.Id = pvs.VariantId
""")
products = {}
for vid, pid, name, mrp, srate, prate, cur_stk, cat_id in cur.fetchall():
    clean_name = (name or '').strip()
    products[vid] = {
        'variant_id': vid,
        'product_id': pid,
        'name': clean_name,
        'mrp': float(mrp or 0),
        'sales_rate': float(srate or 0),
        'purchase_rate': float(prate or 0),
        'recorded_db_stock': float(cur_stk if cur_stk is not None else 0),
        'category_id': cat_id or 0
    }
conn.close()

print(f"Loaded {len(products)} active variants.")

# Aggregate 5-year sales exits and recorded inward stock
sales_exits_5yr = defaultdict(float)
sales_exits_current_year = defaultdict(float)
inward_recorded_5yr = defaultdict(float)

for db_path in sorted(dbs):
    is_current = '2026-2027' in db_path
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
        sales_exits_5yr[vid] += q_out
        inward_recorded_5yr[vid] += q_in
        if is_current:
            sales_exits_current_year[vid] += q_out
    conn.close()

print(f"5-Year exits mapped for {len(sales_exits_5yr)} products.")

# Total store statistics
grand_units_sold = sum(sales_exits_5yr.values())
grand_units_recorded_in = sum(inward_recorded_5yr.values())
print(f"Total 5-Year Units Sold (Exits): {grand_units_sold:,.1f}")
print(f"Total 5-Year Recorded Inward:   {grand_units_recorded_in:,.1f}")
print(f"Unrecorded Inward Stock Deficit: {grand_units_sold - grand_units_recorded_in:,.1f} units")

# Category determination helper
def get_category_type(name):
    n = name.lower()
    if any(k in n for k in ['milk', 'curd', 'batter', 'mavu', 'bread', 'paneer', 'egg', 'dairy', 'yeast']):
        return 'perishable_dairy', 3, 12   # buffer days: 3, pack size: 12
    if any(k in n for k in ['rice', 'arisi', 'sugar', 'oil', 'ghee', 'dal', 'paruppu', 'atta', 'flour', 'maida', 'salt']):
        return 'staples', 14, 25           # buffer days: 14, pack size: 25
    if any(k in n for k in ['snack', 'biscuit', 'soap', 'shampoo', 'paste', 'brush', 'maggi', 'noodle', 'tea', 'coffee', 'masala', 'chilli', 'powder']):
        return 'fast_fmcg', 8, 12          # buffer days: 8, pack size: 12
    if any(k in n for k in ['deepam', 'vilakku', 'thiri', 'camphor', 'agarbathi', 'pooja']):
        return 'festival_pooja', 15, 20    # buffer days: 15, pack size: 20
    return 'general_provisions', 10, 6     # buffer days: 10, pack size: 6

# Compute predicted inward and predicted realistic current working stock
reconstructed_catalog = {}

for vid, p in products.items():
    name = p['name']
    tot_sold = sales_exits_5yr.get(vid, 0.0)
    cur_year_sold = sales_exits_current_year.get(vid, 0.0)
    rec_in = inward_recorded_5yr.get(vid, 0.0)
    
    cat_type, buffer_days, pack_size = get_category_type(name)
    
    # Calculate daily velocity: prioritize current year (236 days elapsed from Apr 1 to Nov 22, 2026)
    # If 0 in current year, use 5-year average (1825 days)
    if cur_year_sold > 0:
        daily_velocity = cur_year_sold / 236.0
    elif tot_sold > 0:
        daily_velocity = tot_sold / 1825.0
    else:
        daily_velocity = 0.0

    # Calculate realistic shelf buffer stock
    if daily_velocity > 0:
        base_stock = daily_velocity * buffer_days
        # Round up to convenient retail display / case quantity
        predicted_stock = max(pack_size, round(base_stock / pack_size) * pack_size)
        # Apply sanity caps based on category
        if cat_type == 'perishable_dairy':
            predicted_stock = min(predicted_stock, 120.0) # Daily perishables rarely exceed 120 units on shelf
        elif cat_type == 'staples':
            predicted_stock = min(predicted_stock, 250.0)
        else:
            predicted_stock = min(predicted_stock, 150.0)
    else:
        # Long-tail item with no recent recorded sales: maintain minimal facing stock
        predicted_stock = float(pack_size if pack_size <= 6 else 4)

    # Predicted total inward stock = total sold + current target stock
    predicted_inward = tot_sold + predicted_stock

    reconstructed_catalog[vid] = {
        'variant_id': vid,
        'product_id': p['product_id'],
        'name': name,
        'category_type': cat_type,
        'mrp': p['mrp'],
        'sales_rate': p['sales_rate'],
        'purchase_rate': p['purchase_rate'],
        'recorded_db_stock': p['recorded_db_stock'],
        '5yr_sold_exits': round(tot_sold, 1),
        'current_year_sold': round(cur_year_sold, 1),
        'recorded_inward': round(rec_in, 1),
        'predicted_inward_intake': round(predicted_inward, 1),
        'unrecorded_intake_gap': round(max(0, predicted_inward - rec_in), 1),
        'daily_velocity': round(daily_velocity, 2),
        'monthly_run_rate': round(daily_velocity * 30.0, 1),
        'predicted_onhand_stock': int(predicted_stock),
        'stock_status': 'in_stock' if predicted_stock >= 8 else 'low_stock'
    }

print(f"\nCalculated realistic inventory prediction for all {len(reconstructed_catalog)} products.")

# Sample high velocity products
print("\nSample Predicted vs Recorded Inventory Levels:")
sample_ids = [3856, 18890, 19996, 17592, 16732, 3716, 18638, 17729, 20402, 896]
print(f"{'VariantId':<10} | {'Name':<32} | {'5-Yr Sold':<10} | {'Old DB Stock':<14} | {'Predicted Stock':<16} | {'Daily Vel':<10}")
print("-" * 105)
for vid in sample_ids:
    if vid in reconstructed_catalog:
        x = reconstructed_catalog[vid]
        print(f"{vid:<10} | {x['name'][:32]:<32} | {x['5yr_sold_exits']:<10.1f} | {x['recorded_db_stock']:<14.1f} | {x['predicted_onhand_stock']:<16} | {x['daily_velocity']:<10.1f}")

# Save master reconstructed stock analysis
out_file = 'data/predicted_5yr_inventory_movement.json'
os.makedirs('data', exist_ok=True)
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump({
        'meta': {
            'generated_at': '2026-11-22T23:35:00+05:30',
            'store': 'Rani Hyper Market, Bodinayakanur',
            'analysis_period': '5 Years (2022 to 2027)',
            'total_products_analyzed': len(reconstructed_catalog),
            'total_5yr_units_sold': round(grand_units_sold, 1),
            'total_recorded_inward': round(grand_units_recorded_in, 1),
            'unrecorded_inward_intake_predicted': round(grand_units_sold - grand_units_recorded_in, 1)
        },
        'products': reconstructed_catalog
    }, f, indent=2)

print(f"\nSaved complete analysis to {out_file} ({os.path.getsize(out_file):,} bytes)")
