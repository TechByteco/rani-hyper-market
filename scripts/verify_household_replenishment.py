import json
import urllib.request
import urllib.parse

BASE_URL = "http://localhost:5500"

def test_replenishment_tracker_endpoint():
    print("\n--- 1. Testing GET /api/replenishment/tracker ---")
    url = f"{BASE_URL}/api/replenishment/tracker"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
    
    assert data.get('success') is True, "Expected success: True"
    tracker = data.get('tracker', [])
    assert len(tracker) >= 40, f"Expected >= 40 tracked households, got {len(tracker)}"
    print(f" [PASS] Tracker contains {len(tracker)} household replenishment records.")
    
    # Check consumption models configuration
    models = data.get('consumptionModels', {})
    assert 'RICE_25KG' in models
    assert 'OIL_5L' in models
    assert 'WASHING_POWDER_1KG' in models
    
    rice_model = models['RICE_25KG']
    assert rice_model['minDays'] == 28 and rice_model['maxDays'] == 32
    assert rice_model['triggerDay'] == 25
    expected_rice_msg = "Time to refill your rice container? Get free 30-minute doorstep delivery in Bodinayakanur. Tap here to order."
    assert rice_model['notificationEnglish'] == expected_rice_msg
    print(f" [PASS] 25kg Rice Sack model strictly verified: 28-32 days, trigger Day 25, exact required alert copy.")
    
    oil_model = models['OIL_5L']
    assert oil_model['minDays'] == 22 and oil_model['maxDays'] == 26
    assert oil_model['triggerDay'] == 20
    print(f" [PASS] 5L Cooking Oil model strictly verified: 22-26 days, trigger Day 20.")
    
    powder_model = models['WASHING_POWDER_1KG']
    assert powder_model['minDays'] == 14 and powder_model['maxDays'] == 18
    assert powder_model['triggerDay'] == 13
    print(f" [PASS] 1kg Washing Powder model strictly verified: 14-18 days, trigger Day 13.")
    
    # Check that a Day 25 Rice purchase exists
    rice_day25_items = [
      r for r in tracker 
      if r.get('packageSize') == '25kg' and r.get('daysElapsed') == 25
    ]
    assert len(rice_day25_items) >= 1, "Expected at least one 25kg Rice record at Day 25 post-purchase"
    first_rice = rice_day25_items[0]
    assert first_rice['notification']['messageEnglish'] == expected_rice_msg
    assert "Bodinayakanur" in first_rice['notification']['messageEnglish']
    print(f" [PASS] Household at Day 25 post-purchase found: {first_rice['customerName']} ({first_rice['customerPhone']}) with alert copy ready.")

def test_due_notifications_endpoint():
    print("\n--- 2. Testing GET /api/replenishment/due-notifications ---")
    url = f"{BASE_URL}/api/replenishment/due-notifications"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        
    assert data.get('success') is True
    due_items = data.get('dueItems', [])
    assert len(due_items) > 0, "Expected due notifications today"
    print(f" [PASS] {len(due_items)} replenishment notifications currently due.")
    
    # Verify every due item has elapsed days >= trigger day
    for item in due_items:
        assert item['daysElapsed'] >= item['triggerDay'], f"Item {item['trackerId']} not yet at trigger day: {item['daysElapsed']} < {item['triggerDay']}"
        assert item['notification']['whatsappUrl'].startswith('https://wa.me/')
    print(f" [PASS] All due items verified at or past trigger threshold with valid WhatsApp dispatch URLs.")

def test_dispatch_and_convert():
    print("\n--- 3. Testing POST /api/replenishment/dispatch and /convert ---")
    # 1. Fetch tracker to pick a due record
    tracker_url = f"{BASE_URL}/api/replenishment/tracker"
    req = urllib.request.Request(tracker_url)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    due_record = next((r for r in data['tracker'] if r['status'] == 'DUE_FOR_REORDER'), None)
    assert due_record is not None, "Expected at least one record with status DUE_FOR_REORDER"
    tracker_id = due_record['trackerId']
    
    # 2. Dispatch notification
    dispatch_url = f"{BASE_URL}/api/replenishment/dispatch"
    payload = json.dumps({'trackerId': tracker_id}).encode('utf-8')
    req = urllib.request.Request(dispatch_url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        disp_res = json.loads(resp.read().decode('utf-8'))
    assert disp_res.get('success') is True
    assert disp_res.get('status') == 'NOTIFICATION_DISPATCHED'
    print(f" [PASS] Notification dispatched for {tracker_id} ({disp_res['customerName']}).")
    
    # 3. Convert reorder
    convert_url = f"{BASE_URL}/api/replenishment/convert"
    c_payload = json.dumps({'trackerId': tracker_id, 'voucherNo': 'POS-REP-TEST-1'}).encode('utf-8')
    req = urllib.request.Request(convert_url, data=c_payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        conv_res = json.loads(resp.read().decode('utf-8'))
    assert conv_res.get('success') is True
    assert conv_res.get('status') == 'CONVERTED'
    assert conv_res.get('retainedGmvInr') > 0
    print(f" [PASS] Reorder conversion recorded for {tracker_id}: Retained ₹{conv_res['retainedGmvInr']} GMV.")

def test_conversion_report_endpoint():
    print("\n--- 4. Testing GET /api/replenishment/report ---")
    url = f"{BASE_URL}/api/replenishment/report"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
    
    assert data.get('success') is True
    summary = data.get('executiveSummary', {})
    assert summary.get('totalTrackedHouseholds') >= 40
    assert summary.get('overallConversionRatePct') > 15.0, f"Expected > 15% conversion rate, got {summary.get('overallConversionRatePct')}"
    assert summary.get('totalGmvRetainedInr') > 10000
    print(f" [PASS] Executive Conversion Report verified: {summary['overallConversionRatePct']}% conversion rate, ₹{summary['totalGmvRetainedInr']} retained GMV.")
    
    categories = data.get('categoryPerformance', [])
    assert len(categories) == 3
    for cat in categories:
        assert cat['dispatched'] > 0
        assert cat['conversionRatePct'] > 0
        print(f" [PASS] Category {cat['category']}: {cat['conversionRatePct']}% conversion rate ({cat['converted']}/{cat['dispatched']} reorders, ₹{cat['gmvRetainedInr']} GMV).")

def test_admin_dashboard_integration():
    print("\n--- 5. Testing Store Director Dashboard (admin.html) ---")
    url = f"{BASE_URL}/admin.html"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        
    assert "household-replenishment-section" in html, "Missing #household-replenishment-section in admin.html"
    assert "rep-stat-conversion-rate" in html, "Missing #rep-stat-conversion-rate in admin.html"
    assert "rep-stat-gmv" in html, "Missing #rep-stat-gmv in admin.html"
    assert "household-replenishment-tbody" in html, "Missing #household-replenishment-tbody in admin.html"
    assert "loadReplenishmentDashboard" in html, "Missing loadReplenishmentDashboard in admin.html"
    assert "batchDispatchAllDueReplenishments" in html, "Missing batchDispatchAllDueReplenishments in admin.html"
    assert "Time to refill your rice container?" in html, "Missing required rice alert copy in admin.html"
    print(f" [PASS] admin.html verified with full Store Director replenishment section, conversion cards, and controllers.")

def test_reorders_predict_backward_compat():
    print("\n--- 6. Testing Backward Compatible GET /api/reorders/predict ---")
    url = f"{BASE_URL}/api/reorders/predict"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
    assert data.get('success') is True
    candidates = data.get('reorder_candidates', [])
    assert len(candidates) > 0, "Expected reorder candidates"
    first = candidates[0]
    assert 'customer_name' in first
    assert 'notification_english' in first
    print(f" [PASS] /api/reorders/predict returned {len(candidates)} candidates powered by Household Consumption Engine.")

if __name__ == '__main__':
    try:
        test_replenishment_tracker_endpoint()
        test_due_notifications_endpoint()
        test_dispatch_and_convert()
        test_conversion_report_endpoint()
        test_admin_dashboard_integration()
        test_reorders_predict_backward_compat()
        print("\n=======================================================")
        print(" ALL 6 HOUSEHOLD CONSUMPTION PREDICTION TESTS PASSED! ")
        print("=======================================================")
    except Exception as e:
        print(f"\n[FAIL] Test failed: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
