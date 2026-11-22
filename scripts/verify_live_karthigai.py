import urllib.request, json

def verify_live():
    print("Testing Live Production Karthigai Deepam Updates...")
    base = "https://rani-hyper-market.vercel.app"

    # 1. Test predict-date for 2026-11-24
    url1 = f"{base}/api/ai/predict-date?date=2026-11-24"
    req1 = urllib.request.Request(url1, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req1) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] /api/ai/predict-date?date=2026-11-24: HTTP {resp.status}")
        print(f"       Event: {data.get('eventName')}")
        print(f"       Sales: Rs.{data.get('projectedSales')} | Bills: {data.get('projectedBills')}")
        print(f"       Checklist Items: {len(data.get('checklist', []))}")
        assert "Karthigai Deepam" in data.get('eventName', ''), "Event name missing Karthigai Deepam"
        assert len(data.get('checklist', [])) > 0, "Checklist items missing"

    # 2. Test predict-date for 2026-11-22 (today)
    url2 = f"{base}/api/ai/predict-date?date=2026-11-22"
    req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req2) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] /api/ai/predict-date?date=2026-11-22: HTTP {resp.status}")
        print(f"       Event: {data.get('eventName')}")
        assert "Karthigai Deepam" in data.get('eventName', ''), "Event name missing Karthigai Deepam"

    # 3. Test Storefront HTML for Karthigai Banner
    url3 = f"{base}/store"
    req3 = urllib.request.Request(url3, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req3) as resp:
        html = resp.read().decode('utf-8')
        print(f"[PASS] /store: HTTP {resp.status}")
        assert "karthigai-festival-banner" in html, "Missing karthigai-festival-banner in store"
        assert "Karthigai Deepam Special" in html, "Missing Karthigai Deepam Special category pill"
        assert "500ML R IDHAYAM GINGELLY OIL" in html, "Missing Gingelly oil in storefront initial items"
        print("       Storefront verified with Karthigai Banner & Category Pill!")

    # 4. Test Admin HTML for Karthigai Surge Alert
    url4 = f"{base}/admin"
    req4 = urllib.request.Request(url4, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req4) as resp:
        html = resp.read().decode('utf-8')
        print(f"[PASS] /admin: HTTP {resp.status}")
        assert "karthigai-surge-alert" in html, "Missing karthigai-surge-alert in admin"
        assert "Karthigai Deepam Stock (Nov 24)" in html, "Missing Karthigai Copilot pill"
        print("       Admin Dashboard verified with Karthigai Surge Alert & AI Copilot Pill!")

    # 5. Test AI Analytics HTML for Karthigai active tab
    url5 = f"{base}/ai-analytics"
    req5 = urllib.request.Request(url5, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req5) as resp:
        html = resp.read().decode('utf-8')
        print(f"[PASS] /ai-analytics: HTTP {resp.status}")
        assert "switchFestivalTab('karthigai_deepam', this)" in html, "Missing Karthigai Deepam active tab"
        print("       AI Analytics verified with Karthigai Deepam as primary active festival!")

    print("\n=======================================================")
    print("ALL 5 LIVE PRODUCTION VERIFICATIONS PASSED 100%!")
    print("=======================================================")

verify_live()
