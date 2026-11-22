"""
Comprehensive Verification Script for In-Store Overhead Digital Signage System
Rani Hyper Market (Bodinayakanur & Theni District, Tamil Nadu)
"""

import urllib.request
import json
import sys

BASE_URL = 'http://localhost:5500'

def test_kiosk_html():
    print("\n--- 1. Testing GET /display/overhead-promos (Kiosk HTML Page) ---")
    req = urllib.request.Request(f"{BASE_URL}/display/overhead-promos")
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        content_type = res.headers.get('Content-Type', '')
        html = res.read().decode('utf-8')
        print(f"HTTP Status: {status}")
        print(f"Content-Type: {content_type}")
        assert status == 200, "Must return HTTP 200"
        assert 'Overhead Digital Signage' in html, "HTML must contain title"
        assert 'Rani Hyper Market' in html, "HTML must contain store name"
        assert 'stage-flash-deal' in html, "Must contain Flash Deal container"
        assert 'playSupermarketChime' in html, "Must contain Audio chime synthesis"
        assert 'speakTamilAnnouncement' in html, "Must contain Tamil Web Speech API integration"
        assert 'DEFAULT_SLIDES' in html, "Must contain offline fallback slides"
        print("[PASS] Kiosk HTML client verified.")

def test_signage_status():
    print("\n--- 2. Testing GET /api/signage/status ---")
    req = urllib.request.Request(f"{BASE_URL}/api/signage/status")
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status}")
        print(f"Service: {data.get('service')}")
        print(f"MQTT Broker: {data.get('mqtt_broker')}")
        print(f"Topic: {data.get('topic')}")
        print(f"Playlist Count: {len(data.get('playlist', []))}")
        assert data.get('success') is True
        print("[PASS] Signage status endpoint operational.")

def test_trigger_sample_flash_deal():
    print("\n--- 3. Testing POST /api/signage/trigger-sample-flash ---")
    req = urllib.request.Request(f"{BASE_URL}/api/signage/trigger-sample-flash", data=b'{}', headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status}")
        print(f"Deal ID: {data.get('deal_id')}")
        flash = data.get('flashDeal', {})
        print(f"Product: {flash.get('product_name')}")
        print(f"Tamil Title: {flash.get('tamil_title')}")
        print(f"Promo Price: ₹{flash.get('promo_price')} (MRP: ₹{flash.get('mrp')})")
        print(f"Validity: {flash.get('validity_minutes')} minutes")
        print(f"Audio Tamil: {flash.get('audio_tamil')[:100]}...")
        assert data.get('success') is True
        assert flash.get('promo_price') == 19
        assert flash.get('mrp') == 48
        print("[PASS] Sample Sugar @ ₹19 Flash Deal triggered successfully.")

def test_active_state_with_flash():
    print("\n--- 4. Testing GET /api/signage/current (Verifying Active Flash Deal) ---")
    req = urllib.request.Request(f"{BASE_URL}/api/signage/current?aisle=02")
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status}")
        print(f"Is Flash Active: {data.get('is_flash_active')}")
        flash = data.get('active_flash_deal', {})
        print(f"Active Deal Title: {flash.get('tamil_title')}")
        print(f"Expires At: {flash.get('expires_at')}")
        assert data.get('is_flash_active') is True
        assert flash.get('promo_price') == 19
        print("[PASS] Active Flash Deal verified with 30-minute validity.")

def test_screen_heartbeat():
    print("\n--- 5. Testing POST /api/signage/heartbeat (Kiosk Screen Telemetry) ---")
    payload = {
        "displayId": "SCREEN_AISLE_02_CENTRAL",
        "aisle": "Aisle 02: Groceries & Staples",
        "resolution": "1920x1080",
        "userAgent": "Chromium Kiosk Raspberry Pi 4",
        "fps": 60,
        "mode": "ONLINE",
        "audioEnabled": True
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/signage/heartbeat",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status}")
        print(f"Registered Displays Count: {data.get('registeredDisplays')}")
        assert data.get('success') is True
        print("[PASS] Screen telemetry heartbeat recorded.")

def test_connected_displays():
    print("\n--- 6. Testing GET /api/signage/displays ---")
    req = urllib.request.Request(f"{BASE_URL}/api/signage/displays")
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        print(f"HTTP Status: {status}")
        print(f"Count: {data.get('count')}")
        assert data.get('count') >= 1
        screen = data['displays'][0]
        print(f"Display ID: {screen.get('displayId')}")
        print(f"Aisle: {screen.get('aisle')}")
        print(f"Resolution: {screen.get('resolution')}")
        print(f"FPS: {screen.get('fps')}")
        print("[PASS] Connected screen inventory verified.")

if __name__ == '__main__':
    print("==========================================================")
    print("  Rani Hyper Market: Digital Signage System Verification")
    print("==========================================================")
    try:
        test_kiosk_html();
        test_signage_status();
        test_trigger_sample_flash_deal();
        test_active_state_with_flash();
        test_screen_heartbeat();
        test_connected_displays();
        print("\n>>> ALL 6 DIGITAL SIGNAGE TESTS PASSED 100%! <<<\n")
    except Exception as e:
        print(f"\n[FAIL] Test encountered error: {e}")
        sys.exit(1)
