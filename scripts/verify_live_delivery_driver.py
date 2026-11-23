#!/usr/bin/env python3
"""
scripts/verify_live_delivery_driver.py
Live Production verification test suite for Store Delivery Driver Portal & Real-Time WhatsApp Updates
Target: https://rani-hyper-market.vercel.app
"""
import urllib.request
import json
import sys

BASE_URL = "https://rani-hyper-market.vercel.app"

def post_json(endpoint, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Content-Length": str(len(data)),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BodiDriverPortal/1.0"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_json(endpoint):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BodiDriverPortal/1.0"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_text(endpoint):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BodiDriverPortal/1.0"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8')

def main():
    print("================================================================")
    print("  VERIFYING LIVE PRODUCTION DELIVERY DRIVER PORTAL")
    print("  Target: https://rani-hyper-market.vercel.app")
    print("================================================================")
    passed = 0
    total = 0

    # 1. Test Live Driver Fleet API
    total += 1
    res_fleet = get_json("/api/driver/fleet")
    print(f"\n[Live Test 1] Driver Fleet Roster:")
    print(f"  Count: {res_fleet.get('count')}, Success: {res_fleet.get('success')}")
    assert res_fleet.get("success") is True
    assert res_fleet.get("count") == 4
    passed += 1
    print("  -> PASS")

    # 2. Test Live Driver Assigned Orders (RIDER-02)
    total += 1
    res_orders = get_json("/api/driver/orders?riderId=RIDER-02")
    print(f"\n[Live Test 2] Driver Assigned Orders:")
    print(f"  Rider: {res_orders.get('rider', {}).get('name')}, Total: {res_orders.get('totalAssignedOrders')}")
    assert res_orders.get("success") is True
    orders = res_orders.get("orders", [])
    assert len(orders) > 0
    first = orders[0]
    assert "googleMapsNavigationUrl" in first
    assert "callLink" in first and first["callLink"].startswith("tel:")
    assert "maskedPhone" in first and "***" in first["maskedPhone"]
    assert "upiPayment" in first
    assert first["upiPayment"].get("merchantVpa") == "saalimin21@oksbi"
    passed += 1
    print("  -> PASS")

    # 3. Test Live Automated WhatsApp Event 1: Order Packed
    total += 1
    print(f"\n[Live Test 3] WhatsApp Event 1: Order Packed:")
    res_packed = post_json("/api/driver/order/status", {
        "orderId": "WA-9402",
        "newStatus": "PACKED",
        "riderId": "RIDER-02"
    })
    assert res_packed.get("success") is True
    notif1 = res_packed.get("notification", {})
    assert "Your Rani Hypermarket order #WA-9402 is packed and leaving the store." in notif1.get("textEnglish", "")
    assert "பேக் செய்யப்பட்டு கடையிலிருந்து புறப்பட தயாராக உள்ளது" in notif1.get("textTamil", "")
    passed += 1
    print("  -> PASS")

    # 4. Test Live Automated WhatsApp Event 2: Out for Delivery
    total += 1
    print(f"\n[Live Test 4] WhatsApp Event 2: Out for Delivery:")
    res_out = post_json("/api/driver/order/status", {
        "orderId": "WA-9402",
        "newStatus": "OUT_FOR_DELIVERY",
        "riderId": "RIDER-02"
    })
    assert res_out.get("success") is True
    notif2 = res_out.get("notification", {})
    assert "M. Manikandan is on his way to your doorstep" in notif2.get("textEnglish", "")
    assert "Estimated arrival:" in notif2.get("textEnglish", "")
    passed += 1
    print("  -> PASS")

    # 5. Test Live Automated WhatsApp Event 3: Delivered
    total += 1
    print(f"\n[Live Test 5] WhatsApp Event 3: Delivered:")
    res_del = post_json("/api/driver/order/status", {
        "orderId": "WA-9402",
        "newStatus": "DELIVERED",
        "riderId": "RIDER-02"
    })
    assert res_del.get("success") is True
    notif3 = res_del.get("notification", {})
    assert "Delivered! Thank you for supporting your local Bodinayakanur supermarket." in notif3.get("textEnglish", "")
    passed += 1
    print("  -> PASS")

    # 6. Test Live Dynamic UPI Intent API
    total += 1
    print(f"\n[Live Test 6] Dynamic UPI Intent API:")
    res_upi = get_json("/api/driver/upi-intent?orderId=WA-9401&amount=1639.00")
    assert res_upi.get("success") is True
    assert res_upi.get("merchantVpa") == "saalimin21@oksbi"
    assert "upi://pay?pa=saalimin21@oksbi" in res_upi.get("upiIntentUrl", "")
    passed += 1
    print("  -> PASS")

    # 7. Test Live Payment Collection API
    total += 1
    print(f"\n[Live Test 7] Payment Collection Recording:")
    res_pay = post_json("/api/driver/collect-payment", {
        "orderId": "WA-9401",
        "paymentMethod": "UPI",
        "amount": 1639.00
    })
    assert res_pay.get("success") is True
    assert res_pay.get("paymentStatus") == "UPI_COLLECTED"
    passed += 1
    print("  -> PASS")

    # 8. Test Live Web Portal HTML (/delivery-driver)
    total += 1
    print(f"\n[Live Test 8] Live Portal HTML (/delivery-driver):")
    html = get_text("/delivery-driver")
    assert "Store Delivery Driver Portal" in html
    assert "RANI HYPER MARKET" in html
    assert "upi-modal" in html
    assert "whatsapp-modal" in html
    assert "saalimin21@oksbi" in html
    passed += 1
    print("  -> PASS")

    print("\n================================================================")
    print(f"  ALL {passed}/{total} LIVE PRODUCTION TESTS PASSED PERFECTLY!")
    print("================================================================")

if __name__ == "__main__":
    main()
