import urllib.request
import json

base_url = 'http://localhost:5500'

endpoints = [
    ('/api/inventory/dead-stock-recovery', 'GET'),
    ('/api/inventory/bundles?limit=3', 'GET'),
    ('/dead_stock_bundles.json', 'GET'),
    ('/api/inventory/scan-dead-stock', 'POST')
]

print("=== TESTING LOCAL DEAD-STOCK ENDPOINTS ===")
for ep, method in endpoints:
    url = f"{base_url}{ep}"
    try:
        req = urllib.request.Request(url, data=b'{}' if method == 'POST' else None, headers={'Content-Type': 'application/json'})
        res = urllib.request.urlopen(req, timeout=10)
        status = res.getcode()
        body = res.read().decode('utf-8')
        data = json.loads(body)
        print(f"[LOCAL OK] {method} {ep} -> HTTP {status} | Keys: {list(data.keys())[:5]}")
    except Exception as e:
        print(f"[LOCAL FAIL] {method} {ep} -> {e}")
