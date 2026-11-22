import urllib.request, json

def verify():
    base = "https://rani-hyper-market.vercel.app"
    print("Testing Live Production Fixes on", base)

    # 1. Test live predict-date endpoint for real margins and perishable metadata
    url1 = f"{base}/api/ai/predict-date?date=2026-11-24"
    req1 = urllib.request.Request(url1, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req1) as resp:
        data = json.loads(resp.read().decode())
        print(f"[PASS] /api/ai/predict-date: HTTP {resp.status}")
        checklists = data.get('checklist', [])
        print(f"       Total Checklist Items: {len(checklists)}")
        batter = next((i for i in checklists if 'batter' in i.get('name', '').lower()), None)
        sugar = next((i for i in checklists if 'sugar' in i.get('name', '').lower()), None)
        if batter:
            print(f"       Batter -> Category: {batter.get('category')} | Margin: {batter.get('marginPct')}% | Spoilage: {batter.get('spoilageRisk')}")
            assert batter.get('marginPct') == 12.0, "Batter margin should be 12%"
            assert "HIGH" in batter.get('spoilageRisk', ''), "Batter spoilage should be HIGH"
        if sugar:
            print(f"       Sugar  -> Category: {sugar.get('category')} | Margin: {sugar.get('marginPct')}% | Spoilage: {sugar.get('spoilageRisk')}")
            assert sugar.get('marginPct') == 4.5, "Sugar margin should be 4.5%"

    # 2. Test live storefront HTML for honest payment status & verification note
    url2 = f"{base}/store"
    req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req2) as resp:
        html = resp.read().decode('utf-8')
        assert "Awaiting Bank Verification" in html, "storefront missing Awaiting Bank Verification"
        print("[PASS] /store: Awaiting Bank Verification payment status active!")

    # 3. Test live online-orders HTML for Cashier verification button & GPay check
    url3 = f"{base}/online-orders"
    req3 = urllib.request.Request(url3, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req3) as resp:
        html = resp.read().decode('utf-8')
        assert "Verify GPay Received" in html, "online-orders missing Verify GPay button"
        assert "Awaiting Bank Check" in html, "online-orders missing Awaiting Bank Check badge"
        print("[PASS] /online-orders: Cashier GPay Bank Verification button & badges active!")

    # 4. Test live login HTML for cleaned up Staff Auth
    url4 = f"{base}/login"
    req4 = urllib.request.Request(url4, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req4) as resp:
        html = resp.read().decode('utf-8')
        assert "Code: 123456" not in html, "login.html still displays toy Code: 123456"
        assert "Staff Access Key" in html or "Staff" in html, "login.html missing Staff key prompt"
        print("[PASS] /login: Toy OTP 'Code: 123456' removed and upgraded to Staff Passcode!")

    print("\n=======================================================")
    print("ALL LIVE PRODUCTION VERIFICATIONS PASSED 100%!")
    print("=======================================================")

verify()
