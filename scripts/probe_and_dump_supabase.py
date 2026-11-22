import urllib.request, json, os

supabase_url = 'https://lofykatlypiywrziwtdp.supabase.co'
supabase_key = 'sb_publishable_8-vFFctJnZYUTZFCmV2rqg_LgHuYjrn'

tables_to_test = [
    'orders', 'store_admins', 'bills', 'customers', 'products', 'sales',
    'online_orders', 'categories', 'tenants', 'transactions', 'sync_log',
    'order_items', 'bill_items', 'retail_companies', 'festival_needs',
    'inventory', 'stock', 'users', 'payments', 'settings'
]

os.makedirs('data/supabase_dump', exist_ok=True)
accessible_tables = {}

for tbl in tables_to_test:
    url = f"{supabase_url}/rest/v1/{tbl}?select=*&limit=1000"
    req = urllib.request.Request(
        url,
        headers={
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Range': '0-999'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            print(f"[FOUND] {tbl}: HTTP {resp.status} | {len(data)} rows retrieved")
            accessible_tables[tbl] = len(data)
            
            # Save table dump
            dump_file = f'data/supabase_dump/{tbl}.json'
            with open(dump_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            if data:
                print(f"        Sample keys: {list(data[0].keys())}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            # Table does not exist in schema
            pass
        elif e.code == 401 or e.code == 403:
            print(f"[AUTH ERROR] {tbl}: HTTP {e.code} (RLS restriction)")
        else:
            print(f"[ERROR] {tbl}: HTTP {e.code} - {e.reason}")
    except Exception as e:
        print(f"[EXCEPTION] {tbl}: {e}")

print("\nAccessible tables summary:", accessible_tables)
