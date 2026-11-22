import json

for p in ['data/online_orders.json', 'public/online_orders.json', 'api/data/online_orders.json']:
    try:
        orders = json.load(open(p, encoding='utf-8'))
        cleaned = [o for o in orders if not str(o.get('id','')).startswith('TEST-DELTA')]
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(cleaned, f, indent=2)
        print(f'Cleaned {p}, orders count: {len(cleaned)}')
    except Exception as e:
        print('Error:', e)
