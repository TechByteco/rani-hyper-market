import urllib.request, json, time

def verify_live():
    base = "https://rani-hyper-market.vercel.app"
    print("Testing Live Production Endpoints on", base)

    # 1. Test /api/inventory/fresh-markdowns
    url_md = f"{base}/api/inventory/fresh-markdowns"
    try:
        req = urllib.request.Request(url_md, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[PASS] {url_md}: HTTP {resp.status} | Total Deals: {data.get('total_deals')}")
    except Exception as e:
        print(f"[PENDING/ERROR] {url_md}: {e}")

    # 2. Test /api/pos/shift/current
    url_shift = f"{base}/api/pos/shift/current"
    try:
        req = urllib.request.Request(url_shift, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[PASS] {url_shift}: HTTP {resp.status} | isOpen: {data.get('isOpen')}")
    except Exception as e:
        print(f"[PENDING/ERROR] {url_shift}: {e}")

    # 3. Test /api/sync/delta
    url_sync = f"{base}/api/sync/delta"
    try:
        req = urllib.request.Request(url_sync, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[PASS] {url_sync}: HTTP {resp.status} | status: {data.get('status')}")
    except Exception as e:
        print(f"[PENDING/ERROR] {url_sync}: {e}")

    # 4. Check HTML pages for new elements
    for page, token, desc in [
        ('store', 'id="zero-waste-shelf"', 'Zero-Waste Shelf'),
        ('online-orders', 'id="webhook-sim-modal"', 'Webhook Simulator Modal'),
        ('admin', 'id="rbac-role-switcher"', 'RBAC Switcher'),
        ('ai-analytics', 'Zero-Waste Spoilage Saved', 'Zero-Waste Analytics Card')
    ]:
        url_p = f"{base}/{page}"
        try:
            req = urllib.request.Request(url_p, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                html = resp.read().decode()
                has_token = token in html
                print(f"[{'PASS' if has_token else 'BUILDING'}] {url_p}: {desc} present: {has_token}")
        except Exception as e:
            print(f"[ERROR] {url_p}: {e}")

if __name__ == '__main__':
    verify_live()
