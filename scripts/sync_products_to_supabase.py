import json
import urllib.request

SUPABASE_URL = 'https://lofykatlypiywrziwtdp.supabase.co'
SUPABASE_KEY = 'sb_publishable_8-vFFctJnZYUTZFCmV2rqg_LgHuYjrn'
TENANT_ID = '37a64e83-514d-4b00-b90a-9af172dacdd6'

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

with open('products_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print(f"Total catalog products: {len(catalog)}")

# Take top 50 popular/staple items to keep cloud cache responsive and within REST payload limits
batch_items = catalog[:50]
payload = []
for p in batch_items:
    payload.append({
        "title": p.get('title') or f"Product #{p.get('id')}",
        "description": f"Fresh supermarket grocery from Rani Hyper Market (Unit: {p.get('unit', '1 unit')})",
        "price": float(p.get('price', 0)),
        "unit": p.get('unit') or "1 unit",
        "stock_quantity": int(p.get('stock') or 50),
        "image_url": p.get('image_url') or p.get('image') or "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
        "is_available": True,
        "tenant_id": TENANT_ID
    })

url = f'{SUPABASE_URL}/rest/v1/products'
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as resp:
        print(f"[OK] Supabase Products sync HTTP status: {resp.status}")
except urllib.error.HTTPError as e:
    print(f"[WARN] Supabase sync HTTP {e.code}: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"[ERROR] Supabase sync error: {e}")
