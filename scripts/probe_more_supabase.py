import urllib.request, json

supabase_url = 'https://lofykatlypiywrziwtdp.supabase.co'
supabase_key = 'sb_publishable_8-vFFctJnZYUTZFCmV2rqg_LgHuYjrn'

more_tables = [
    'pos_orders', 'pos_sales', 'sales_orders', 'invoices', 'invoice_items',
    'ledger_postings', 'stock_postings', 'product_variants', 'customer_points',
    'audit_logs', 'deltas', 'sync_queue', 'offline_orders', 'vouchers'
]

for tbl in more_tables:
    url = f"{supabase_url}/rest/v1/{tbl}?select=*&limit=10"
    req = urllib.request.Request(
        url,
        headers={
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            print(f"[FOUND] {tbl}: HTTP {resp.status} | {len(data)} rows")
    except urllib.error.HTTPError as e:
        if e.code != 404:
            print(f"[{e.code}] {tbl}: {e.reason}")
    except: pass
