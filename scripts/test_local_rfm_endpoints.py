import urllib.request
import json

base_url = 'http://localhost:5500'

endpoints = [
    '/api/analytics/rfm-cohorts',
    '/api/analytics/rfm-customers?limit=3',
    '/api/customer_rfm_partitions.json'
]

for ep in endpoints:
    try:
        req = urllib.request.urlopen(f"{base_url}{ep}", timeout=5)
        status = req.getcode()
        body = req.read().decode('utf-8')
        data = json.loads(body)
        print(f"[OK] {ep} -> HTTP {status} | Keys: {list(data.keys())[:5]}")
    except Exception as e:
        print(f"[FAIL] {ep} -> {e}")
