import json
import urllib.request
import urllib.parse

BASE_URL = "https://rani-hyper-market.vercel.app"

def test_live_tracker_endpoint():
    print("\n--- 1. Testing Live GET /api/replenishment/tracker ---")
    url = f"{BASE_URL}/api/replenishment/tracker"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
    
    assert data.get('success') is True, "Expected success: True"
    tracker = data.get('tracker', [])
    assert len(tracker) >= 40, f"Expected >= 40 tracked households, got {len(tracker)}"
    print(f" [PASS] Live Tracker contains {len(tracker)} household replenishment records.")
    
    models = data.get('consumptionModels', {})
    assert models['RICE_25KG']['triggerDay'] == 25
    expected_rice_msg = "Time to refill your rice container? Get free 30-minute doorstep delivery in Bodinayakanur. Tap here to order."
    assert models['RICE_25KG']['notificationEnglish'] == expected_rice_msg
    print(f" [PASS] Live 25kg Rice Sack model strictly verified: Day 25 trigger with exact copy.")

def test_live_due_notifications_endpoint():
    print("\n--- 2. Testing Live GET /api/replenishment/due-notifications ---")
    url = f"{BASE_URL}/api/replenishment/due-notifications"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        
    assert data.get('success') is True
    due_items = data.get('dueItems', [])
    assert len(due_items) > 0
    print(f" [PASS] {len(due_items)} live replenishment notifications currently due.")

def test_live_conversion_report_endpoint():
    print("\n--- 3. Testing Live GET /api/replenishment/report ---")
    url = f"{BASE_URL}/api/replenishment/report"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
    
    assert data.get('success') is True
    summary = data.get('executiveSummary', {})
    assert summary.get('totalTrackedHouseholds') >= 40
    print(f" [PASS] Live Executive Conversion Report: {summary.get('overallConversionRatePct')}% conversion rate, ₹{summary.get('totalGmvRetainedInr')} retained GMV.")

def test_live_admin_dashboard_integration():
    print("\n--- 4. Testing Live Store Director Dashboard (admin.html) ---")
    url = f"{BASE_URL}/admin.html"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        
    assert "household-replenishment-section" in html, "Missing #household-replenishment-section in live admin.html"
    assert "rep-stat-conversion-rate" in html, "Missing #rep-stat-conversion-rate in live admin.html"
    assert "Time to refill your rice container?" in html, "Missing required rice alert copy in live admin.html"
    print(f" [PASS] Live admin.html verified with full Store Director replenishment section and conversion cards.")

if __name__ == '__main__':
    try:
        test_live_tracker_endpoint()
        test_live_due_notifications_endpoint()
        test_live_conversion_report_endpoint()
        test_live_admin_dashboard_integration()
        print("\n============================================================")
        print(" ALL 4 LIVE PRODUCTION REPLENISHMENT ENGINE TESTS PASSED! ")
        print("============================================================")
    except Exception as e:
        print(f"\n[FAIL] Live test failed: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
