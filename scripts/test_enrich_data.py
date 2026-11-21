import json, os, re

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    mined_data = json.load(f)

print(f"Loaded mined empirical data for {len(mined_data)} festivals.")

# Let's verify sample festival
fest_id = 'pongal_harvest'
print(f"Sample mined data for {fest_id}:")
print("Top 5 recommended_stock_needs:")
for item in mined_data[fest_id]['recommended_stock_needs'][:5]:
    print(f"  {item['name']}: Rec Qty {item['recommended_order_qty']}, Price ₹{item['price']}, Cost ₹{item['cost']}, Priority: {item['priority']}")
