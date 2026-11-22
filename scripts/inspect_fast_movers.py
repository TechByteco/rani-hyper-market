import json

with open('data/predicted_5yr_inventory_movement.json', 'r', encoding='utf-8') as f:
    pred_data = json.load(f)

products = pred_data.get('products', {})

# Fast movers: daily_velocity > 0.5 or 5yr_sold_exits > 1000
fast_movers = []
for vid, p in products.items():
    v = p.get('daily_velocity', 0)
    sold_5yr = p.get('5yr_sold_exits', 0)
    sales_rate = p.get('sales_rate', 0)
    purchase_rate = p.get('purchase_rate', 0)
    if (v >= 0.2 or sold_5yr >= 200) and sales_rate > 0:
        fast_movers.append({
            'variant_id': int(vid),
            'name': p.get('name'),
            'category': p.get('category_type'),
            'sales_rate': sales_rate,
            'purchase_rate': purchase_rate,
            'daily_velocity': v,
            '5yr_sold_exits': sold_5yr
        })

fast_movers.sort(key=lambda x: -x['5yr_sold_exits'])
print(f"Total High-Velocity Fast Movers: {len(fast_movers)}")
print("Top 15 Fast-Moving Anchor SKUs:")
for fm in fast_movers[:15]:
    print(f"  {fm['name']} | Price: Rs.{fm['sales_rate']} | Cost: Rs.{fm['purchase_rate']} | 5Yr Sold: {fm['5yr_sold_exits']} | Velocity: {fm['daily_velocity']}/day")
