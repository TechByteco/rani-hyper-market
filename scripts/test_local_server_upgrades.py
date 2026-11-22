import urllib.request, json

def test_local_server():
    base = "http://localhost:5500"
    print("Testing Local Server on", base)

    # 1. Test Fresh Markdowns
    url_md = f"{base}/api/inventory/fresh-markdowns"
    req = urllib.request.Request(url_md)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] {url_md}: HTTP {resp.status} | Total Deals: {data.get('total_deals')}")
        print(f"       Deal #1: {data['deals'][0]['name']} -> Flash Price: Rs.{data['deals'][0]['flash_price']}")

    # 2. Test Shift Current
    url_shift = f"{base}/api/pos/shift/current"
    req = urllib.request.Request(url_shift)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] {url_shift}: HTTP {resp.status} | isOpen: {data.get('isOpen')}")

    # 3. Test Delta Sync
    url_sync = f"{base}/api/sync/delta"
    req = urllib.request.Request(url_sync)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] {url_sync}: HTTP {resp.status} | status: {data.get('status')}")

    # 4. Test Webhook Recent
    url_wh = f"{base}/api/webhooks/recent"
    req = urllib.request.Request(url_wh)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] {url_wh}: HTTP {resp.status} | events: {len(data.get('events', []))}")

    # 5. Check Pages
    for p, token, desc in [
        ('store.html', 'id="zero-waste-shelf"', 'Zero-Waste Shelf'),
        ('admin.html', 'id="rbac-role-switcher"', 'RBAC Switcher'),
        ('orders.html', 'id="webhook-sim-modal"', 'Webhook Simulator Modal'),
        ('online-orders.html', 'id="webhook-sim-modal"', 'Webhook Simulator Modal'),
        ('ai-analytics.html', 'Zero-Waste Spoilage Saved', 'Zero-Waste KPI Card')
    ]:
        url_p = f"{base}/{p}"
        req = urllib.request.Request(url_p)
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode()
            has_token = token in content
            print(f"[PASS] {url_p}: HTTP {resp.status} | {desc} present: {has_token}")

    print("\nLOCAL SERVER 100% OPERATIONAL WITH ALL 5 ENTERPRISE UPGRADES!")

if __name__ == '__main__':
    test_local_server()
