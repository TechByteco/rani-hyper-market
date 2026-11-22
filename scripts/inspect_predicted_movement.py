import json

p_path = 'data/predicted_5yr_inventory_movement.json'
with open(p_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total items in predicted movement: {len(data)}")
sample = list(data.items())[:3]
for k, v in sample:
    print(k, v)
