import json
import urllib.request
import urllib.parse
import re

BASE_URL = "http://localhost:5500"

def test_radar_endpoint():
    print("\n--- 1. Testing GET /api/competitive/radar ---")
    url = f"{BASE_URL}/api/competitive/radar"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
    
    assert data.get('success') is True, "Expected success: True"
    items = data.get('items', [])
    assert len(items) == 50, f"Expected 50 items, got {len(items)}"
    print(f" [PASS] 50 commodities returned successfully.")
    
    # Check categories
    categories = set(c.get('category') for c in items)
    assert len(categories) == 6, f"Expected 6 categories, got {len(categories)}: {categories}"
    print(f" [PASS] 6 commodity categories present: {categories}")
    
    # Check math formulas
    for item in items:
        comp_price = item['competitorPrice']
        rani_price = item['raniPrice']
        expected_delta_pct = round(((comp_price - rani_price) / comp_price) * 100.0, 1)
        actual_delta_pct = item['priceDeltaPct']
        assert abs(expected_delta_pct - actual_delta_pct) < 0.25, \
            f"Math mismatch for {item['sku']}: expected {expected_delta_pct}, got {actual_delta_pct}"
        
        expected_savings = round(comp_price - rani_price, 2)
        assert abs(expected_savings - item['savingsInr']) < 0.25, \
            f"Savings mismatch for {item['sku']}: expected {expected_savings}, got {item['savingsInr']}"
    print(f" [PASS] PriceDelta % and Savings ₹ formulas strictly verified across all 50 items.")
    
    # Check summary metrics
    summary = data.get('summaryMetrics', {})
    assert data.get('totalCommoditiesTracked') == 50
    assert summary.get('itemsCheaperCount') >= 45, f"Expected >= 45 cheaper items, got {summary.get('itemsCheaperCount')}"
    assert summary.get('averagePriceDeltaPct') > 10.0, f"Expected > 10% avg savings, got {summary.get('averagePriceDeltaPct')}"
    assert summary.get('totalBasketSavingsInr') > 1000, f"Expected > 1000 basket savings, got {summary.get('totalBasketSavingsInr')}"
    print(f" [PASS] Storewide summary metrics verified: {summary['averagePriceDeltaPct']}% avg savings, ₹{summary['totalBasketSavingsInr']} basket savings, {summary['itemsCheaperCount']}/50 cheaper.")

def test_banners_endpoint():
    print("\n--- 2. Testing GET /api/competitive/banners ---")
    url = f"{BASE_URL}/api/competitive/banners"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        
    assert data.get('success') is True
    banners = data.get('banners', [])
    assert len(banners) > 0, "Expected at least one eligible banner"
    print(f" [PASS] {len(banners)} high-savings banners generated.")
    
    for b in banners:
        assert b['priceDeltaPct'] >= 8.0, f"Banner item {b['sku']} below 8.0% threshold: {b['priceDeltaPct']}"
        sc = b.get('socialCopy', {})
        assert "Why pay ₹" in sc.get('englishText', ''), f"English copy format invalid: {sc.get('englishText')}"
        assert "Bodinayakanur Rani Hyper Market" in sc.get('englishText', '')
        assert "போடிநாயக்கனூர் ராணி ஹைப்பர் மார்க்கெட்" in sc.get('tamilText', '')
        assert sc.get('bannerImageUrl', '').startswith('/api/competitive/banner-image?sku=')
    print(f" [PASS] All banners strictly conform to >= 8% threshold and standardized bilingual ad copies.")

def test_banner_image_endpoint():
    print("\n--- 3. Testing GET /api/competitive/banner-image ---")
    sku = "OIL-GOLD-1L"
    url = f"{BASE_URL}/api/competitive/banner-image?sku={sku}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        content_type = resp.headers.get('Content-Type')
        assert 'image/svg+xml' in content_type, f"Expected image/svg+xml, got {content_type}"
        svg_content = resp.read().decode('utf-8')
        
    assert "<svg" in svg_content, "Expected valid SVG output"
    assert "Gold Winner Refined Sunflower Oil" in svg_content
    assert "₹128" in svg_content
    assert "Rani Hyper Market" in svg_content
    assert "Bodinayakanur" in svg_content
    print(f" [PASS] SVG banner graphic rendered perfectly (Content-Type: {content_type}, length: {len(svg_content)} bytes).")

def test_refresh_endpoint():
    print("\n--- 4. Testing POST /api/competitive/refresh ---")
    url = f"{BASE_URL}/api/competitive/refresh"
    req = urllib.request.Request(url, data=b"{}", headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
    assert data.get('success') is True
    assert data.get('totalCommoditiesTracked') == 50
    print(f" [PASS] Price radar resample trigger successful.")

def test_storefront_html():
    print("\n--- 5. Testing Storefront HTML integration ---")
    url = f"{BASE_URL}/store.html"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        
    assert "quick-commerce-radar-section" in html, "Missing #quick-commerce-radar-section in store.html"
    assert "radar-commodities-grid" in html, "Missing #radar-commodities-grid in store.html"
    assert "comparative-banner-modal" in html, "Missing #comparative-banner-modal in store.html"
    assert "loadCompetitiveRadar" in html, "Missing loadCompetitiveRadar in store.html"
    assert "filterRadarCategory" in html, "Missing filterRadarCategory in store.html"
    assert "openComparativeBannerModal" in html, "Missing openComparativeBannerModal in store.html"
    print(f" [PASS] store.html verified with full radar widget, modal, and client controllers.")

if __name__ == '__main__':
    try:
        test_radar_endpoint()
        test_banners_endpoint()
        test_banner_image_endpoint()
        test_refresh_endpoint()
        test_storefront_html()
        print("\n==============================================")
        print(" ALL 5 COMPETITIVE PRICE RADAR TESTS PASSED! ")
        print("==============================================")
    except Exception as e:
        print(f"\n[FAIL] Test failed: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
