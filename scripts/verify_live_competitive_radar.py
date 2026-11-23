import json
import urllib.request
import urllib.parse

BASE_URL = "https://rani-hyper-market.vercel.app"

def test_live_radar_endpoint():
    print("\n--- 1. Testing Live GET /api/competitive/radar ---")
    url = f"{BASE_URL}/api/competitive/radar"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
    
    assert data.get('success') is True, "Expected success: True"
    items = data.get('items', [])
    assert len(items) == 50, f"Expected 50 items, got {len(items)}"
    print(f" [PASS] 50 live commodities returned successfully.")
    
    # Check summary metrics
    summary = data.get('summaryMetrics', {})
    assert data.get('totalCommoditiesTracked') == 50
    assert summary.get('itemsCheaperCount') >= 45
    assert summary.get('averagePriceDeltaPct') > 10.0
    print(f" [PASS] Storewide summary metrics verified on live production: {summary['averagePriceDeltaPct']}% avg savings, {summary['itemsCheaperCount']}/50 cheaper.")

def test_live_banners_endpoint():
    print("\n--- 2. Testing Live GET /api/competitive/banners ---")
    url = f"{BASE_URL}/api/competitive/banners"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        
    assert data.get('success') is True
    banners = data.get('banners', [])
    assert len(banners) > 0, "Expected at least one eligible banner"
    print(f" [PASS] {len(banners)} high-savings banners live on production.")
    
    for b in banners:
        assert b['priceDeltaPct'] >= 8.0
        sc = b.get('socialCopy', {})
        assert "Why pay ₹" in sc.get('englishText', '')
        assert "Bodinayakanur Rani Hyper Market" in sc.get('englishText', '')
    print(f" [PASS] Live banners strictly conform to >= 8% threshold and standardized bilingual ad copies.")

def test_live_banner_image_endpoint():
    print("\n--- 3. Testing Live GET /api/competitive/banner-image ---")
    sku = "OIL-GOLD-1L"
    url = f"{BASE_URL}/api/competitive/banner-image?sku={sku}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        content_type = resp.headers.get('Content-Type')
        assert 'image/svg+xml' in content_type, f"Expected image/svg+xml, got {content_type}"
        svg_content = resp.read().decode('utf-8')
        
    assert "<svg" in svg_content
    assert "Gold Winner Refined Sunflower Oil" in svg_content
    assert "₹128" in svg_content
    assert "Rani Hyper Market" in svg_content
    print(f" [PASS] Live SVG banner graphic rendered perfectly (Content-Type: {content_type}, length: {len(svg_content)} bytes).")

def test_live_storefront_html():
    print("\n--- 4. Testing Live Storefront HTML integration ---")
    url = f"{BASE_URL}/store.html"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        
    assert "quick-commerce-radar-section" in html, "Missing #quick-commerce-radar-section in live store.html"
    assert "radar-commodities-grid" in html, "Missing #radar-commodities-grid in live store.html"
    assert "comparative-banner-modal" in html, "Missing #comparative-banner-modal in live store.html"
    print(f" [PASS] Live store.html verified with full radar widget and comparative modal.")

if __name__ == '__main__':
    try:
        test_live_radar_endpoint()
        test_live_banners_endpoint()
        test_live_banner_image_endpoint()
        test_live_storefront_html()
        print("\n=======================================================")
        print(" ALL 4 LIVE PRODUCTION COMPETITIVE RADAR TESTS PASSED! ")
        print("=======================================================")
    except Exception as e:
        print(f"\n[FAIL] Live test failed: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
