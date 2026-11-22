import urllib.request, json

endpoints = [
    ('/api/inventory/fresh-markdowns', 'Fresh Markdowns'),
    ('/api/pos/shift/current', 'Shift Current'),
    ('/api/sync/delta', 'Delta Sync'),
    ('/api/webhooks/recent', 'Recent Webhooks'),
    ('/api/notifications/whatsapp-log', 'WhatsApp Log')
]

for ep, name in endpoints:
    url = f'http://localhost:5500{ep}'
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            print(f"[PASS] {name} ({ep}): HTTP {resp.status}")
    except Exception as e:
        print(f"[FAIL] {name} ({ep}): {e}")

print("All endpoints tested!")
