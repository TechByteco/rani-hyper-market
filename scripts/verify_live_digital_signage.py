"""
Live Production Verification for Digital Signage Broadcaster
Target: https://rani-hyper-market.vercel.app
"""

import urllib.request
import json
import sys

PROD_URL = 'https://rani-hyper-market.vercel.app'

def run_live_signage_tests():
    print("==========================================================")
    print("  LIVE PRODUCTION TEST: Rani Overhead Digital Signage")
    print("==========================================================")

    # 1. Kiosk HTML
    print("\n[1] Testing GET /display/overhead-promos on Production...")
    req = urllib.request.Request(f"{PROD_URL}/display/overhead-promos", headers={'User-Agent': 'Chromium Kiosk'})
    with urllib.request.urlopen(req, timeout=10) as res:
        status = res.status
        content_type = res.headers.get('Content-Type', '')
        html = res.read().decode('utf-8')
        print(f"Status Code: {status}")
        print(f"Content-Type: {content_type}")
        assert status == 200
        assert 'Overhead Digital Signage' in html
        assert 'stage-flash-deal' in html
        assert 'speakTamilAnnouncement' in html

    # 2. Signage Status
    print("\n[2] Testing GET /api/signage/status on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/signage/status")
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Service: {data.get('service')}")
        print(f"Supermarket: {data.get('supermarket')}")
        print(f"Topic: {data.get('topic')}")
        assert data.get('success') is True

    # 3. Trigger Flash Deal (Sugar @ ₹19)
    print("\n[3] Testing POST /api/signage/trigger-sample-flash on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/signage/trigger-sample-flash", data=b'{}', headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Deal ID: {data.get('deal_id')}")
        flash = data.get('flashDeal', {})
        print(f"Product: {flash.get('product_name')}")
        print(f"Price: ₹{flash.get('promo_price')} (MRP: ₹{flash.get('mrp')})")
        print(f"Tamil Title: {flash.get('tamil_title')}")
        assert data.get('success') is True
        assert flash.get('promo_price') == 19

    # 4. Active State
    print("\n[4] Testing GET /api/signage/current on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/signage/current?aisle=02")
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Is Flash Active: {data.get('is_flash_active')}")
        print(f"Active Deal Title: {data.get('active_flash_deal', {}).get('tamil_title')}")
        assert data.get('is_flash_active') is True

    # 5. Heartbeat
    print("\n[5] Testing POST /api/signage/heartbeat on Production...")
    heartbeat_payload = {
        "displayId": "PROD_SCREEN_AISLE_01",
        "aisle": "Aisle 01: Rice & Grains",
        "resolution": "1920x1080",
        "fps": 60,
        "mode": "ONLINE",
        "audioEnabled": True
    }
    req = urllib.request.Request(
        f"{PROD_URL}/api/signage/heartbeat",
        data=json.dumps(heartbeat_payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Registered Displays: {data.get('registeredDisplays')}")
        assert data.get('success') is True

    # 6. Displays List
    print("\n[6] Testing GET /api/signage/displays on Production...")
    req = urllib.request.Request(f"{PROD_URL}/api/signage/displays")
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Status Code: {res.status}")
        print(f"Displays Count: {data.get('count')}")
        assert data.get('success') is True

    print("\n>>> LIVE PRODUCTION DIGITAL SIGNAGE VERIFIED: ALL 6 ENDPOINTS 100% OPERATIONAL! <<<\n")

if __name__ == '__main__':
    run_live_signage_tests()
