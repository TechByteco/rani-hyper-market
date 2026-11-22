import json

with open('products_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print(f"Total catalog products: {len(catalog)}")
if catalog:
    print("Sample catalog item keys:", list(catalog[0].keys()))
    print("Sample item:", catalog[0])
