import json

for p in ['initial_products.json', 'products_catalog.json', 'rani_products.json']:
    with open(p, 'r', encoding='utf-8') as f:
        d = json.load(f)
    print(f"\n--- {p} ({len(d)} items) ---")
    if isinstance(d, list) and len(d) > 0:
        item = d[0]
        print("  Sample item keys:", list(item.keys())[:10])
        print(f"  Title: {item.get('title') or item.get('name')}")
        print(f"  Stock: {item.get('stock')}")
        # check how many have stock > 0
        stocks = [x.get('stock') for x in d if 'stock' in x]
        print(f"  Items with 'stock' key: {len(stocks)} | Min: {min(stocks) if stocks else None} | Max: {max(stocks) if stocks else None}")
