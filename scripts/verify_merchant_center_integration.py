"""
Comprehensive Verification Script for Google Merchant Center Feed & Content API
Rani Hyper Market (Bodinayakanur, Theni District, Tamil Nadu)
"""

import urllib.request
import json
import xml.etree.ElementTree as ET
import sys

BASE_URL = 'http://localhost:5500'

def test_merchant_status():
    print("\n--- 1. Testing GET /api/merchant/status ---")
    req = urllib.request.Request(f"{BASE_URL}/api/merchant/status")
    with urllib.request.urlopen(req, timeout=5) as res:
        status_code = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status_code}")
        print(f"Store: {data.get('store')}")
        print(f"Merchant ID: {data.get('merchantId')}")
        print(f"Total Products in Feed: {data.get('feed', {}).get('totalProducts')}")
        print(f"GTIN Coverage: {data.get('feed', {}).get('gtinCoveragePercent')}")
        print(f"Feed Size: {data.get('feed', {}).get('sizeFormatted')}")
        print(f"Schedule: {data.get('feed', {}).get('schedule')}")
        assert data.get('success') is True, "Status must be success: True"
        print("[PASS] Status endpoint operational.")

def test_feed_streaming():
    print("\n--- 2. Testing GET /api/feed/google-merchant.xml ---")
    req = urllib.request.Request(f"{BASE_URL}/api/feed/google-merchant.xml")
    with urllib.request.urlopen(req, timeout=10) as res:
        status_code = res.status
        headers = dict(res.getheaders())
        content_type = headers.get('Content-Type', '')
        print(f"HTTP Status: {status_code}")
        print(f"Content-Type: {content_type}")
        assert 'xml' in content_type.lower(), "Content-Type must be XML"
        
        # Read initial chunk or full content
        xml_bytes = res.read()
        print(f"Downloaded bytes: {len(xml_bytes)} ({len(xml_bytes)/(1024*1024):.2f} MB)")
        
        # Parse XML
        root = ET.fromstring(xml_bytes)
        assert root.tag == 'rss', f"Root tag must be rss, got {root.tag}"
        channel = root.find('channel')
        assert channel is not None, "Channel must exist"
        items = channel.findall('item')
        print(f"Parsed items count: {len(items)}")
        assert len(items) >= 7000, f"Expected 7,000+ items, got {len(items)}"

        # Check bilingual presence on first item
        first_item = items[0]
        desc = first_item.find('g:description', {'g': 'http://base.google.com/ns/1.0'})
        if desc is None:
            desc = first_item.find('{http://base.google.com/ns/1.0}description')
        desc_text = desc.text if desc is not None else ''
        
        print("First Item Description Sample (first 200 chars):")
        print(desc_text[:200])
        assert '[English]' in desc_text, "Description must contain [English]"
        assert '[தமிழ் விவரம்]' in desc_text or 'ராணி' in desc_text, "Description must contain Tamil script"
        assert 'Bodinayakanur' in desc_text, "Description must contain Bodinayakanur location"
        print("[PASS] XML Feed streaming and bilingual content verified.")

def test_delta_update():
    print("\n--- 3. Testing POST /api/merchant/delta-update ---")
    payload = {
        "skuId": "RANI-SKU-1001",
        "barcode": "8901030383847",
        "title": "Ponni Boiled Rice 25kg",
        "oldPrice": 1250,
        "newPrice": 1199,
        "oldMrp": 1350,
        "newMrp": 1350,
        "stock": 42,
        "inStock": True,
        "source": "CASHIER_POS_BILLING_DESK",
        "cashierId": "COUNTER_02_THENI"
    }
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/merchant/delta-update",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        status_code = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status_code}")
        print(f"Delta ID: {data.get('deltaId')}")
        print(f"Status: {data.get('status')}")
        print("Generated Google Content API v2.1 Payload:")
        print(json.dumps(data.get('googleContentApiPayload'), indent=2))
        assert data.get('success') is True, "Delta update must be success: True"
        assert data.get('deltaId') is not None, "Delta ID must be generated"
        print("[PASS] Instant cash counter delta update recorded.")

def test_delta_queue():
    print("\n--- 4. Testing GET /api/merchant/delta-queue ---")
    req = urllib.request.Request(f"{BASE_URL}/api/merchant/delta-queue?limit=10")
    with urllib.request.urlopen(req, timeout=5) as res:
        status_code = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status_code}")
        print(f"Queue count: {data.get('count')}")
        assert data.get('success') is True, "Delta queue must be success: True"
        assert len(data.get('queue', [])) > 0, "Queue must contain recent updates"
        latest = data['queue'][0]
        print(f"Latest Delta: {latest.get('deltaId')} - SKU: {latest.get('skuId')} Price: {latest.get('changes', {}).get('price')}")
        print("[PASS] Delta queue journal verified.")

def test_content_api_sync():
    print("\n--- 5. Testing POST /api/merchant/sync-content-api ---")
    req = urllib.request.Request(
        f"{BASE_URL}/api/merchant/sync-content-api",
        data=b'{}',
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        status_code = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status_code}")
        print(f"Synced Count: {data.get('syncedCount')}")
        print(f"Merchant ID: {data.get('merchantId')}")
        print(f"Google API Response: {data.get('googleApiResponse', {}).get('kind')}")
        assert data.get('success') is True, "Sync must be success: True"
        print("[PASS] Google Content API custombatch push verified.")

def test_cron_rebuild():
    print("\n--- 6. Testing GET /api/cron/merchant-feed (02:00 AM IST Regenerator) ---")
    req = urllib.request.Request(f"{BASE_URL}/api/cron/merchant-feed")
    with urllib.request.urlopen(req, timeout=10) as res:
        status_code = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status_code}")
        print(f"Trigger: {data.get('trigger')}")
        print(f"Execution Time: {data.get('executionTimeMs')} ms")
        print(f"Feed SKUs: {data.get('feed', {}).get('totalProducts')}")
        print(f"Feed Size: {data.get('feed', {}).get('sizeFormatted')}")
        assert data.get('success') is True, "Cron rebuild must be success: True"
        print("[PASS] Automated 02:00 AM IST Cron Regenerator verified.")

if __name__ == '__main__':
    print("==========================================================")
    print("  Rani Hyper Market: Google Merchant Center Feed Tester")
    print("==========================================================")
    try:
        test_merchant_status()
        test_feed_streaming()
        test_delta_update()
        test_delta_queue()
        test_content_api_sync()
        test_cron_rebuild()
        print("\n>>> ALL 6 GOOGLE MERCHANT CENTER TESTS PASSED 100%! <<<\n")
    except Exception as e:
        print(f"\n[FAIL] Test encountered error: {e}")
        sys.exit(1)
