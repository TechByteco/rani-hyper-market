#!/usr/bin/env python3
"""
scripts/verify_delivery_driver.py
Verification test suite for Store Delivery Driver Portal & Real-Time WhatsApp Communications
Tests Fleet, Assigned Orders, Google Maps Navigation, Masked Calling, Dynamic UPI QR, and 3-Event WhatsApp Updates.
"""
import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:5500"

def post_json(endpoint, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Content-Length": str(len(data)),
            "Connection": "close"
        }
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_json(endpoint):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers={"Connection": "close"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_text(endpoint):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers={"Connection": "close"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.read().decode('utf-8')

def main():
    print("================================================================")
    print("  VERIFYING DELIVERY DRIVER PORTAL & REAL-TIME COMMUNICATIONS")
    print("================================================================")
    passed = 0
    total = 0

    # 1. Test Driver Fleet API
    total += 1
    res_fleet = get_json("/api/driver/fleet")
    print(f"\n[Test 1] Driver Fleet Roster:")
    print(f"  Count: {res_fleet.get('count')}, Success: {res_fleet.get('success')}")
    assert res_fleet.get("success") is True
    assert res_fleet.get("count") == 4
    fleet = res_fleet.get("fleet", [])
    assert len(fleet) == 4
    for d in fleet:
        assert "id" in d and "name" in d and "vehicle" in d and "phone" in d
        print(f"    - [{d['id']}] {d['name']} ({d['phone']}) - Vehicle: {d['vehicle']} (Rating: {d['rating']})")
    passed += 1
    print("  -> PASS")

    # 2. Test Assigned Orders for Driver RIDER-02 (M. Manikandan)
    total += 1
    res_orders = get_json("/api/driver/orders?riderId=RIDER-02")
    print(f"\n[Test 2] Driver Assigned Orders (RIDER-02):")
    print(f"  Rider: {res_orders.get('rider', {}).get('name')}, Manifest: {res_orders.get('manifestId')}, Total: {res_orders.get('totalAssignedOrders')}")
    assert res_orders.get("success") is True
    assert res_orders.get("rider", {}).get("name") == "M. Manikandan"
    orders = res_orders.get("orders", [])
    assert len(orders) > 0
    first_order = orders[0]
    
    # 2.1 Verify 1-click Google Maps Navigation Link
    assert "googleMapsNavigationUrl" in first_order
    assert "google.com/maps/dir" in first_order["googleMapsNavigationUrl"]
    assert "destination=" in first_order["googleMapsNavigationUrl"]
    print(f"    - Google Maps Nav URL: {first_order['googleMapsNavigationUrl'][:65]}...")

    # 2.2 Verify "Call Customer" Masked Phone & VoIP link
    assert "callLink" in first_order and first_order["callLink"].startswith("tel:")
    assert "maskedPhone" in first_order and "***" in first_order["maskedPhone"]
    print(f"    - Customer: {first_order['customerName']}, Masked: {first_order['maskedPhone']}, Call Link: {first_order['callLink']}")

    # 2.3 Verify "Collect Cash / Collect UPI QR" parameters
    assert "upiPayment" in first_order
    upi = first_order["upiPayment"]
    assert upi.get("merchantVpa") == "saalimin21@oksbi"
    assert "upi://" in upi.get("upiIntentUrl", "")
    assert "phonepe://" in upi.get("phonePeIntentUrl", "")
    assert "tez://" in upi.get("gPayIntentUrl", "")
    assert "api.qrserver.com" in upi.get("qrCodeUrl", "")
    print(f"    - UPI VPA: {upi.get('merchantVpa')}, Payee: {upi.get('payeeName')}, Amount: Rs.{upi.get('amountInr')}")
    print(f"    - UPI Intent: {upi.get('upiIntentUrl')[:65]}...")

    passed += 1
    print("  -> PASS")

    # 3. Test Automated Customer WhatsApp Updates: Event 1 -> Order Packed
    total += 1
    print(f"\n[Test 3] Customer WhatsApp Event 1: Order Packed")
    res_packed = post_json("/api/driver/order/status", {
        "orderId": "WA-9402",
        "newStatus": "PACKED",
        "riderId": "RIDER-02"
    })
    assert res_packed.get("success") is True
    notif1 = res_packed.get("notification", {})
    expected_packed_eng = "Your Rani Hypermarket order #WA-9402 is packed and leaving the store."
    assert expected_packed_eng in notif1.get("textEnglish", "")
    assert "பேக் செய்யப்பட்டு கடையிலிருந்து புறப்பட தயாராக உள்ளது" in notif1.get("textTamil", "")
    assert "wa.me/" in notif1.get("whatsappUrl", "")
    print(f"  English: \"{notif1.get('textEnglish')}\"")
    print(f"  Tamil:   \"{notif1.get('textTamil')}\"")
    passed += 1
    print("  -> PASS")

    # 4. Test Automated Customer WhatsApp Updates: Event 2 -> Out for Delivery
    total += 1
    print(f"\n[Test 4] Customer WhatsApp Event 2: Out for Delivery")
    res_out = post_json("/api/driver/order/status", {
        "orderId": "WA-9402",
        "newStatus": "OUT_FOR_DELIVERY",
        "riderId": "RIDER-02"
    })
    assert res_out.get("success") is True
    notif2 = res_out.get("notification", {})
    assert "M. Manikandan is on his way to your doorstep" in notif2.get("textEnglish", "")
    assert "Estimated arrival:" in notif2.get("textEnglish", "")
    assert "உங்கள் வீட்டிற்கு டெலிவரி செய்ய புறப்பட்டுவிட்டார்" in notif2.get("textTamil", "")
    print(f"  English: \"{notif2.get('textEnglish')}\"")
    print(f"  Tamil:   \"{notif2.get('textTamil')}\"")
    passed += 1
    print("  -> PASS")

    # 5. Test Automated Customer WhatsApp Updates: Event 3 -> Delivered
    total += 1
    print(f"\n[Test 5] Customer WhatsApp Event 3: Delivered")
    res_del = post_json("/api/driver/order/status", {
        "orderId": "WA-9402",
        "newStatus": "DELIVERED",
        "riderId": "RIDER-02"
    })
    assert res_del.get("success") is True
    notif3 = res_del.get("notification", {})
    expected_del_eng = "Delivered! Thank you for supporting your local Bodinayakanur supermarket."
    assert expected_del_eng in notif3.get("textEnglish", "")
    assert "டெலிவரி செய்யப்பட்டது! உங்கள் உள்ளூர் போடிநாயக்கனூர் ராணி ஹைப்பர் மார்க்கெட்டை ஆதரித்ததற்கு" in notif3.get("textTamil", "")
    assert "orders.html?inv=WA-9402" in notif3.get("fullBilingualMessage", "")
    print(f"  English: \"{notif3.get('textEnglish')}\"")
    print(f"  Tamil:   \"{notif3.get('textTamil')}\"")
    passed += 1
    print("  -> PASS")

    # 6. Test Dynamic UPI Intent Endpoint
    total += 1
    print(f"\n[Test 6] Dynamic UPI Intent API (/api/driver/upi-intent):")
    res_upi = get_json("/api/driver/upi-intent?orderId=WA-9401&amount=1639.00")
    assert res_upi.get("success") is True
    assert res_upi.get("merchantVpa") == "saalimin21@oksbi"
    assert res_upi.get("amountInr") == 1639.00
    assert "upi://pay?pa=saalimin21@oksbi" in res_upi.get("upiIntentUrl", "")
    assert "phonepe://pay?pa=saalimin21@oksbi" in res_upi.get("phonePeIntentUrl", "")
    print(f"  Merchant: {res_upi.get('merchantVpa')}, Amt: Rs.{res_upi.get('amountInr')}")
    print(f"  PhonePe Intent: {res_upi.get('phonePeIntentUrl')[:65]}...")
    passed += 1
    print("  -> PASS")

    # 7. Test Payment Collection Recording
    total += 1
    print(f"\n[Test 7] Payment Collection Recording (/api/driver/collect-payment):")
    res_pay = post_json("/api/driver/collect-payment", {
        "orderId": "WA-9401",
        "paymentMethod": "UPI",
        "amount": 1639.00
    })
    assert res_pay.get("success") is True
    assert res_pay.get("paymentStatus") == "UPI_COLLECTED"
    print(f"  Order: {res_pay.get('orderId')}, Status: {res_pay.get('paymentStatus')}, Amount: Rs.{res_pay.get('amountCollected')}")
    passed += 1
    print("  -> PASS")

    # 8. Test Mobile Delivery Driver Portal Web Page (/delivery-driver)
    total += 1
    print(f"\n[Test 8] Delivery Driver Web Portal HTML (/delivery-driver):")
    html = get_text("/delivery-driver")
    assert "Store Delivery Driver Portal" in html
    assert "RANI HYPER MARKET" in html
    assert "upi-modal" in html
    assert "whatsapp-modal" in html
    assert "M. Manikandan" in html
    assert "saalimin21@oksbi" in html
    print(f"  Verified /delivery-driver serves mobile PWA driver portal successfully!")
    passed += 1
    print("  -> PASS")

    print("\n================================================================")
    print(f"  ALL {passed}/{total} DELIVERY DRIVER TESTS PASSED PERFECTLY!")
    print("================================================================")

if __name__ == "__main__":
    main()
