import sqlite3
import json
import datetime
import os

ref_date = datetime.date(2026, 11, 21)

# 1. Load SQLite last sold dates
db = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db)
cur = conn.cursor()

last_sold = {}
rows = cur.execute("""
    SELECT tp.VariantId, MAX(t.VoucherDate), COUNT(tp.Quantity), SUM(tp.Quantity)
    FROM TransProducts tp
    JOIN Transactions t ON tp.TransId = t.Id
    WHERE t.IsActive = 1
    GROUP BY tp.VariantId
""").fetchall()
for vid, vdate, cnt, qty in rows:
    if vdate:
        try:
            d = datetime.datetime.strptime(vdate[:10], '%Y-%m-%d').date()
            last_sold[vid] = (ref_date - d).days
        except: pass

conn.close()

# 2. Load predicted movement data (has purchase_rate / landed cost)
with open('data/predicted_5yr_inventory_movement.json', 'r', encoding='utf-8') as f:
    pred_data = json.load(f)

products = pred_data.get('products', {})
print(f"Total products in predicted movement: {len(products)}")

dead_stock_candidates = []
total_capital_locked = 0.0

for vid_str, p in products.items():
    vid = int(vid_str)
    # Days since last sold
    days_stagnant = last_sold.get(vid, 365) # if not sold in 2026-2027, at least 1 year stagnant
    
    # Current stock
    stock = p.get('predicted_onhand_stock', 0)
    landed_cost = p.get('purchase_rate') or (p.get('sales_rate', 0) * 0.82)
    sales_rate = p.get('sales_rate', 0)
    mrp = p.get('mrp', sales_rate)
    
    if days_stagnant >= 60 and stock >= 15:
        cap_locked = stock * landed_cost
        total_capital_locked += cap_locked
        dead_stock_candidates.append({
            'variant_id': vid,
            'name': p.get('name'),
            'category': p.get('category_type'),
            'days_stagnant': days_stagnant,
            'current_stock': stock,
            'landed_cost': round(landed_cost, 2),
            'sales_rate': sales_rate,
            'mrp': mrp,
            'capital_locked': round(cap_locked, 2)
        })

print(f"Found {len(dead_stock_candidates)} dead-stock SKUs with >= 15 units unsold for >= 60 days.")
print(f"Total Capital Locked: Rs. {total_capital_locked:,.2f}")

# Sort by capital locked descending
dead_stock_candidates.sort(key=lambda x: -x['capital_locked'])
print("\nTop 10 Dead Stock Candidates by Capital Locked:")
for c in dead_stock_candidates[:10]:
    print(f"  {c['name']} | Stock: {c['current_stock']} | LandedCost: Rs.{c['landed_cost']} | Stagnant: {c['days_stagnant']}d | Locked: Rs.{c['capital_locked']:,.2f}")
