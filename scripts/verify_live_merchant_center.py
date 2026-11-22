"""
Live Production Verification for Google Merchant Center Feed & Content API
Target: https://rani-hyper-market.vercel.app
"""

import urllib.request
import json
import xml.etree.ElementTree as ET
import sys

PROD_URL = 'https://rani-hyper-market.vercel.app'

def run_live_tests():
    print("==========================================================")
    print("  LIVE PRODUCTION TEST: Rani Hyper Market Google Merchant")
    print("==========================================================")

    # 1. Status
    print("\n[1] Testing GET /api/merchant/status on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/merchant/status", headers={'User-Agent': 'Googlebot/2.1'})
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Store: {data.get('store')}")
        print(f"Total Products: {data.get('feed', {}).get('totalProducts')}")
        print(f"GTIN Coverage: {data.get('feed', {}).get('gtinCoveragePercent')}")
        print(f"Feed Size: {data.get('feed', {}).get('sizeFormatted')}")
        print(f"Schedule: {data.get('feed', {}).get('schedule')}")
        assert data.get('success') is True

    # 2. Feed Stream
    print("\n[2] Testing GET /google-merchant-feed.xml on Production...")
    req = urllib.request.Request(f"{PROD_URL}/google-merchant-feed.xml", headers={'User-Agent': 'Googlebot/2.1'})
    with urllib.request.urlopen(req, timeout=15) as res:
        content_type = res.headers.get('Content-Type', '')
        print(f"Status Code: {res.status}")
        print(f"Content-Type: {content_type}")
        assert 'xml' in content_type.lower()
        chunk = res.read(8192).decode('utf-8', errors='ignore')
        print(f"Feed Header Sample:\n{chunk[:350]}...")
        assert '<rss version="2.0"' in chunk
        assert 'xmlns:g="http://base.google.com/ns/1.0"' in chunk
        assert 'Rani Hyper Market' in chunk

    # 3. Cash Counter Delta Update
    print("\n[3] Testing POST /api/merchant/delta-update on Production...")
    delta_payload = {
        "skuId": "RANI-SKU-9",
        "barcode": "89006245",
        "title": "Iodex 8G",
        "oldPrice": 47,
        "newPrice": 46,
        "oldMrp": 48,
        "newMrp": 48,
        "stock": 10,
        "inStock": True,
        "source": "PROD_CASHIER_COUNTER_01",
        "cashierId": "CASHIER_BODI_MAIN"
    }
    req = urllib.request.Request(
        f"{PROD_URL}/api/merchant/delta-update",
        data=json.dumps(delta_payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'RaniPOS/2.0'}
    )
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Delta ID: {data.get('deltaId')}")
        print(f"Status: {data.get('status')}")
        assert data.get('success') is True

    # 4. Delta Queue
    print("\n[4] Testing GET /api/merchant/delta-queue on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/merchant/delta-queue?limit=5")
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Queue Count: {data.get('count')}")
        assert data.get('success') is True

    # 5. Content API Sync
    print("\n[5] Testing POST /api/merchant/sync-content-api on Production...")
    req = urllib.request.Request(
        f"{PROD_URL}/api/merchant/sync-content-api",
        data=b'{}',
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Synced Count: {data.get('syncedCount')}")
        assert data.get('success') is True

    # 6. Cron Rebuild Endpoint
    print("\n[6] Testing GET /api/cron/merchant-feed on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/cron/merchant-feed")
    with urllib.request.urlopen(req, timeout=15) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Trigger: {data.get('trigger')}")
        print(f"Execution Time: {data.get('executionTimeMs')} ms")
        assert data.get('success') is True

    print("\n>>> LIVE PRODUCTION VERIFICATION COMPLETE: ALL 6 ENDPOINTS 100% OPERATIONAL! <<<\n")

if __name__ == '__main__':
    run_live_tests()
