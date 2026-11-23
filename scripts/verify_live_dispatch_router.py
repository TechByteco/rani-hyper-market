#!/usr/bin/env python3
"""
scripts/verify_live_dispatch_router.py
Live Production verification test suite for Hyper-Local Logistics & Route Optimization Router
Runs against https://rani-hyper-market.vercel.app
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
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BodiDispatchRouter/1.0"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_json(endpoint):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BodiDispatchRouter/1.0"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_text(endpoint):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BodiDispatchRouter/1.0"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8')

def main():
    print("================================================================")
    print("  VERIFYING LIVE PRODUCTION HYPER-LOCAL DISPATCH ROUTER")
    print("  Target: https://rani-hyper-market.vercel.app")
    print("================================================================")
    passed = 0
    total = 0

    # 1. Test Live Geofence Validation: Subramanya Siva Nagar (Express <= 6km)
    total += 1
    res1 = post_json("/api/dispatch/geofence/validate", {
        "address": "Subramanya Siva Nagar, Bodinayakanur"
    })
    print(f"\n[Live Test 1] Subramanya Siva Nagar:")
    print(f"  Tier: {res1.get('tier')}, Distance: {res1.get('distanceKm')}km, Inside Polygon: {res1.get('insideMunicipalPolygon')}")
    assert res1.get("tier") == "30_MIN_EXPRESS"
    assert res1.get("insideMunicipalPolygon") is True
    assert res1.get("distanceKm") < 6.0
    passed += 1
    print("  -> PASS")

    # 2. Test Live Geofence Validation: Paramasivan Temple area
    total += 1
    res2 = post_json("/api/dispatch/geofence/validate", {
        "address": "Paramasivan Temple area, Bodinayakanur"
    })
    print(f"\n[Live Test 2] Paramasivan Temple area:")
    print(f"  Tier: {res2.get('tier')}, Distance: {res2.get('distanceKm')}km")
    assert res2.get("tier") == "30_MIN_EXPRESS"
    passed += 1
    print("  -> PASS")

    # 3. Test Live Geofence Validation: Theni Bypass Road (Same-Day 6-12km)
    total += 1
    res3 = post_json("/api/dispatch/geofence/validate", {
        "address": "Theni Bypass Road, Bodinayakanur"
    })
    print(f"\n[Live Test 3] Theni Bypass Road (6-12km):")
    print(f"  Tier: {res3.get('tier')}, Distance: {res3.get('distanceKm')}km, Fee: Rs.{res3.get('deliveryFeeInr')}")
    assert res3.get("tier") == "SAME_DAY_DELIVERY"
    assert 6.0 <= res3.get("distanceKm") <= 12.0
    assert res3.get("deliveryFeeInr") == 30
    passed += 1
    print("  -> PASS")

    # 4. Test Live Fleet Roster API
    total += 1
    res_fleet = get_json("/api/dispatch/fleet")
    print(f"\n[Live Test 4] Fleet Roster:")
    print(f"  Total Riders: {res_fleet.get('totalRiders')}, Available: {res_fleet.get('availableCount')}")
    assert res_fleet.get("success") is True
    assert res_fleet.get("totalRiders") == 4
    assert len(res_fleet.get("fleet", [])) == 4
    passed += 1
    print("  -> PASS")

    # 5. Test Live Cluster Manifest Generation (Batches of max 4)
    total += 1
    res_cluster = post_json("/api/dispatch/cluster-manifest", {})
    print(f"\n[Live Test 5] Cluster Manifests:")
    print(f"  Generated: {res_cluster.get('totalManifestsGenerated')} manifests")
    assert res_cluster.get("success") is True
    manifests = res_cluster.get("manifests", [])
    assert len(manifests) > 0
    for m in manifests:
        assert m.get("batchCount") <= 4
        assert "googleMapsUrl" in m and "google.com/maps/dir" in m["googleMapsUrl"]
        assert "whatsappShareText" in m
        print(f"    - Manifest #{m.get('manifestId')}: Ward '{m.get('ward')}', {m.get('batchCount')} drops, {m.get('totalDistanceKm')}km, Rider: {m.get('rider', {}).get('name')}")
    passed += 1
    print("  -> PASS")

    # 6. Test Live 3-Minute Store Picker Packing Slip
    total += 1
    res_slip = get_json("/api/dispatch/packing-slip?orderId=WA-9401")
    print(f"\n[Live Test 6] 3-Minute Picker Packing Slip:")
    print(f"  Order: {res_slip.get('orderId')}, Tote: {res_slip.get('toteTag')}, SLA Target: {res_slip.get('pickerTargetTime')}")
    assert res_slip.get("success") is True
    items = res_slip.get("items", [])
    assert len(items) > 0
    passed += 1
    print("  -> PASS")

    # 7. Test Live 80mm Thermal Printable Slip HTML
    total += 1
    html_slip = get_text("/api/dispatch/packing-slip/print?orderId=WA-9401")
    print(f"\n[Live Test 7] Printable Thermal Slip HTML:")
    assert "3-MINUTE PICKER SLA" in html_slip or "Store Picker Slip" in html_slip
    assert "RANI HYPER MARKET" in html_slip
    assert "80mm" in html_slip
    passed += 1
    print("  -> PASS")

    # 8. Test Online Orders UI Page with Dispatch Router
    total += 1
    html_orders = get_text("/online-orders")
    assert "Hyper-Local Logistics &amp; Dark Store Delivery Router" in html_orders or "Hyper-Local Logistics" in html_orders
    assert "dispatch-manifest-modal" in html_orders
    assert "geofence-validator-modal" in html_orders
    passed += 1
    print("\n[Live Test 8] Online Orders UI Page:")
    print("  Verified Dispatch Router controls and modals present in live UI HTML!")
    print("  -> PASS")

    print("\n================================================================")
    print(f"  ALL {passed}/{total} LIVE PRODUCTION TESTS PASSED PERFECTLY!")
    print("================================================================")

if __name__ == "__main__":
    main()
