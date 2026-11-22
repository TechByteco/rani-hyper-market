import urllib.request
import json

base_url = 'https://rani-hyper-market.vercel.app'

tests = [
    ('/api/inventory/dead-stock-recovery', True),
    ('/api/inventory/bundles?limit=3', True),
    ('/dead_stock_bundles.json', True),
    ('/ai-analytics.html', False)
]

print("=== VERIFYING LIVE VERCEL PRODUCTION ENDPOINTS ===")
for path, is_json in tests:
    url = f"{base_url}{path}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=10)
        status = res.getcode()
        body = res.read().decode('utf-8')
        if is_json:
            data = json.loads(body)
            print(f"[LIVE OK] {path} -> HTTP {status} | Keys: {list(data.keys())[:5]}")
        else:
            has_section = 'Automated Dead-Stock Capital Recovery' in body
            print(f"[LIVE OK] {path} -> HTTP {status} | Size: {len(body)} chars | Has Dead-Stock Section: {has_section}")
    except Exception as e:
        print(f"[LIVE FAIL] {path} -> {e}")
