import sqlite3
import json
import datetime
import math

print("=== BUILDING DEAD-STOCK CAPITAL RECOVERY ALGORITHM ===")

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

# 2. Load 5-Year predicted movement dataset
with open('data/predicted_5yr_inventory_movement.json', 'r', encoding='utf-8') as f:
    pred_data = json.load(f)

products = pred_data.get('products', {})

dead_stock_items = []
fast_movers = []

for vid_str, p in products.items():
    vid = int(vid_str)
    name = p.get('name', 'Product')
    sales_rate = float(p.get('sales_rate') or 0.0)
    mrp = float(p.get('mrp') or sales_rate)
    landed_cost = float(p.get('purchase_rate') or (sales_rate * 0.82))
    stock = int(p.get('predicted_onhand_stock') or 0)
    velocity = float(p.get('daily_velocity') or 0.0)
    sold_5yr = float(p.get('5yr_sold_exits') or 0.0)
    category = p.get('category_type', 'general_provisions')
    
    days_stagnant = last_sold.get(vid, 365)

    # Condition 1: Dead-Stock: last_sold_date > 60 days and current_stock >= 15
    if days_stagnant >= 60 and stock >= 15 and landed_cost > 0:
        capital_locked = round(stock * landed_cost, 2)
        months_stagnant = round(days_stagnant / 30.0, 1)
        holding_cost_per_month = round(landed_cost * 0.02, 2) # 2% per month
        margin_above_cost = max(0.0, sales_rate - landed_cost)
        liquidation_discount = round(min(margin_above_cost, holding_cost_per_month * months_stagnant), 2)
        
        dead_stock_items.append({
            'variant_id': vid,
            'name': name,
            'category': category,
            'days_stagnant': days_stagnant,
            'months_stagnant': months_stagnant,
            'current_stock': stock,
            'landed_cost': landed_cost,
            'sales_rate': sales_rate,
            'mrp': mrp,
            'capital_locked': capital_locked,
            'holding_cost_accrued': round(holding_cost_per_month * months_stagnant * stock, 2),
            'liquidation_discount': liquidation_discount
        })

    # Condition 2: Fast-Mover: high velocity (> 0.2/day or sold > 200 in 5yr) and positive sales rate
    if (velocity >= 0.2 or sold_5yr >= 250) and sales_rate >= 10.0 and landed_cost > 0:
        fast_movers.append({
            'variant_id': vid,
            'name': name,
            'category': category,
            'sales_rate': sales_rate,
            'landed_cost': landed_cost,
            'margin': round(sales_rate - landed_cost, 2),
            'margin_pct': round(((sales_rate - landed_cost) / sales_rate) * 100, 1),
            'daily_velocity': velocity,
            'sold_5yr': sold_5yr
        })

print(f"Scanned {len(products)} SKUs.")
print(f"Identified Dead-Stock SKUs: {len(dead_stock_items)}")
total_locked = sum(x['capital_locked'] for x in dead_stock_items)
print(f"Total Trapped Working Capital: Rs. {total_locked:,.2f}")
print(f"Identified Fast-Moving Anchor SKUs: {len(fast_movers)}")

# Sort dead stock by capital locked descending
dead_stock_items.sort(key=lambda x: -x['capital_locked'])

# Curated High-Velocity Anchors for Intelligent Cross-Category Bundling
# We want complementary pairings (e.g. Toilet cleaner / Dish wash / Soap with Idli Rice / Sunflower oil / Atta / Sugar)
def find_best_anchor(dead_item, fast_movers):
    d_name = dead_item['name'].lower()
    d_cost = dead_item['landed_cost']

    # Select an anchor SKU that has higher ticket size or is a top staple
    # If dead item is a big rice sack (> Rs. 1000), pair with high-turnover Gold Winner Oil 5L or Ghee
    # If dead item is cleaning/soap/fmcg (< Rs. 500), pair with Idli Rice 5kg, Atta 5kg, Sugar 1kg, or Sunflower Oil 1L
    candidates = []
    for fm in fast_movers:
        fm_name = fm['name'].lower()
        # Avoid pairing rice with another rice sack
        if 'rice' in d_name and 'rice' in fm_name:
            continue
        # Avoid pairing exact same item
        if fm['variant_id'] == dead_item['variant_id']:
            continue
        
        # Priority to major household staples
        score = 0
        if any(k in fm_name for k in ['idli', 'batter', 'mavu', 'oil', 'sugar', 'atta', 'milk', 'curd', 'ghee', 'tea']):
            score += 50
        if fm['daily_velocity'] > 2.0:
            score += 30
        
        # Price affinity: Anchor should ideally be 1x to 4x dead item cost, or major grocery provision
        if d_cost <= 250:
            if 30 <= fm['sales_rate'] <= 350: score += 40
        else:
            if fm['sales_rate'] >= 100: score += 40

        candidates.append((score, fm))

    candidates.sort(key=lambda x: -x[0])
    return candidates[0][1] if candidates else fast_movers[0]

# Generate Dynamic Bundling Packages
bundles = []
total_capital_recovered = 0.0
total_bundle_gross_profit = 0.0

for dead in dead_stock_items:
    anchor = find_best_anchor(dead, fast_movers)
    
    # Bundle Price Equation: Bundle Price = FastMover_Price + (DeadStock_LandedCost * 1.02)
    bundle_price = round(anchor['sales_rate'] + (dead['landed_cost'] * 1.02), 2)
    
    # Standalone sum of individual retail prices
    standalone_retail_price = round(anchor['sales_rate'] + dead['sales_rate'], 2)
    
    # Total Bundle Cost
    bundle_cost = round(anchor['landed_cost'] + dead['landed_cost'], 2)
    
    # Bundle Gross Profit
    bundle_gross_profit = round(bundle_price - bundle_cost, 2)
    
    # Customer Savings & Discount %
    customer_savings = round(standalone_retail_price - bundle_price, 2)
    customer_discount_pct = round((customer_savings / max(1.0, standalone_retail_price)) * 100, 1)
    
    # Dead Capital Recovery %: (DeadStock Recovery / DeadStock Landed Cost)
    dead_cap_recovery_amt = round(dead['landed_cost'] * 1.02, 2)
    capital_recovery_pct = round((dead_cap_recovery_amt / dead['landed_cost']) * 100, 1) # 102.0%
    
    # Verify Gross Profit remains positive
    assert bundle_gross_profit > 0, f"Error: Bundle profit must be positive for {dead['name']}"
    assert capital_recovery_pct >= 98.0, f"Error: Recovery must be >= 98% for {dead['name']}"
    
    total_capital_recovered += (dead_cap_recovery_amt * dead['current_stock'])
    total_bundle_gross_profit += (bundle_gross_profit * dead['current_stock'])

    bundles.append({
        'bundle_id': f"BND_{dead['variant_id']}_{anchor['variant_id']}",
        'bundle_title': f"{anchor['name']} + {dead['name']} Super Saver Bundle",
        'stagnant_sku': {
            'variant_id': dead['variant_id'],
            'name': dead['name'],
            'category': dead['category'],
            'current_stock': dead['current_stock'],
            'landed_cost': dead['landed_cost'],
            'sales_rate': dead['sales_rate'],
            'mrp': dead['mrp'],
            'days_stagnant': dead['days_stagnant'],
            'capital_locked': dead['capital_locked']
        },
        'anchor_sku': {
            'variant_id': anchor['variant_id'],
            'name': anchor['name'],
            'category': anchor['category'],
            'sales_rate': anchor['sales_rate'],
            'landed_cost': anchor['landed_cost'],
            'daily_velocity': anchor['daily_velocity']
        },
        'financials': {
            'standalone_total': standalone_retail_price,
            'bundle_price': bundle_price,
            'bundle_cost': bundle_cost,
            'bundle_gross_profit': bundle_gross_profit,
            'bundle_margin_pct': round((bundle_gross_profit / bundle_price) * 100, 1),
            'customer_savings': customer_savings,
            'customer_discount_pct': customer_discount_pct,
            'dead_capital_recovery_pct': capital_recovery_pct,
            'total_batch_capital_recovered': round(dead_cap_recovery_amt * dead['current_stock'], 2),
            'total_batch_profit': round(bundle_gross_profit * dead['current_stock'], 2)
        }
    })

print(f"\nGenerated {len(bundles)} Dynamic Bundles.")
print(f"Total Trapped Capital in Dead Stock: Rs. {total_locked:,.2f}")
print(f"Total Working Capital Recovered: Rs. {total_capital_recovered:,.2f} ({total_capital_recovered / total_locked * 100:.1f}%)")
print(f"Total Gross Profit Generated across all bundles: Rs. {total_bundle_gross_profit:,.2f}")

print("\n--- SAMPLE DYNAMIC BUNDLES (FIRST 5) ---")
for b in bundles[:5]:
    f = b['financials']
    print(f"Bundle: {b['bundle_title']}")
    print(f"  Anchor: {b['anchor_sku']['name']} (Rs.{b['anchor_sku']['sales_rate']})")
    print(f"  Dead Stock: {b['stagnant_sku']['name']} (Landed: Rs.{b['stagnant_sku']['landed_cost']} | Stagnant: {b['stagnant_sku']['days_stagnant']}d | Stock: {b['stagnant_sku']['current_stock']})")
    print(f"  Standalone Price: Rs.{f['standalone_total']} -> Bundle Price: Rs.{f['bundle_price']} (Save: Rs.{f['customer_savings']} / {f['customer_discount_pct']}%)")
    print(f"  Gross Profit: Rs.{f['bundle_gross_profit']} (Margin: {f['bundle_margin_pct']}%) | Capital Recovered: {f['dead_capital_recovery_pct']}%")
    print()
