#!/usr/bin/env python3
"""
scripts/verify_dispatch_router.py
Thorough verification test suite for Hyper-Local Logistics & Route Optimization Router
Tests Turf.js Geofencing, Rider Fleet, Nearest Neighbor Clustering, and 3-Minute Picker Slip.
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
    print("  VERIFYING HYPER-LOCAL DISPATCH ROUTER & GEOFENCE ENGINE")
    print("================================================================")
    passed = 0
    total = 0

    # 1. Test Geofence Validation: Subramanya Siva Nagar (Express <= 6km)
    total += 1
    res1 = post_json("/api/dispatch/geofence/validate", {
        "address": "Subramanya Siva Nagar, Bodinayakanur"
    })
    print(f"\n[Test 1] Subramanya Siva Nagar:")
    print(f"  Tier: {res1.get('tier')}, Distance: {res1.get('distanceKm')}km, Inside Polygon: {res1.get('insideMunicipalPolygon')}")
    assert res1.get("tier") == "30_MIN_EXPRESS", f"Expected 30_MIN_EXPRESS, got {res1.get('tier')}"
    assert res1.get("insideMunicipalPolygon") is True
    assert res1.get("distanceKm") < 6.0
    assert "30-Minute Express" in res1.get("promiseText", "")
    passed += 1
    print("  -> PASS")

    # 2. Test Geofence Validation: Paramasivan Temple area (Express <= 6km)
    total += 1
    res2 = post_json("/api/dispatch/geofence/validate", {
        "address": "Paramasivan Temple area, Bodinayakanur"
    })
    print(f"\n[Test 2] Paramasivan Temple area:")
    print(f"  Tier: {res2.get('tier')}, Distance: {res2.get('distanceKm')}km")
    assert res2.get("tier") == "30_MIN_EXPRESS"
    assert res2.get("distanceKm") < 2.0
    passed += 1
    print("  -> PASS")

    # 3. Test Geofence Validation: Theni Bypass Road (Same-Day 6-12km)
    total += 1
    res3 = post_json("/api/dispatch/geofence/validate", {
        "address": "Theni Bypass Road, Bodinayakanur"
    })
    print(f"\n[Test 3] Theni Bypass Road (6-12km):")
    print(f"  Tier: {res3.get('tier')}, Distance: {res3.get('distanceKm')}km, Fee: Rs.{res3.get('deliveryFeeInr')}")
    assert res3.get("tier") == "SAME_DAY_DELIVERY"
    assert 6.0 <= res3.get("distanceKm") <= 12.0
    assert res3.get("deliveryFeeInr") == 30
    passed += 1
    print("  -> PASS")

    # 4. Test Geofence Validation: Out of Boundary (>12km)
    total += 1
    res4 = post_json("/api/dispatch/geofence/validate", {
        "coords": [77.2000, 9.8000] # Far outside Bodi
    })
    print(f"\n[Test 4] Out of Delivery Zone (>12km):")
    print(f"  Tier: {res4.get('tier')}, Distance: {res4.get('distanceKm')}km")
    assert res4.get("tier") == "OUT_OF_GEOFENCE"
    passed += 1
    print("  -> PASS")

    # 5. Test Fleet Roster API
    total += 1
    res_fleet = get_json("/api/dispatch/fleet")
    print(f"\n[Test 5] Fleet Roster:")
    print(f"  Total Riders: {res_fleet.get('totalRiders')}, Available: {res_fleet.get('availableCount')}")
    assert res_fleet.get("success") is True
    assert res_fleet.get("totalRiders") == 4
    assert len(res_fleet.get("fleet", [])) == 4
    passed += 1
    print("  -> PASS")

    # 6. Test Cluster Manifest Generation (Batches of max 4)
    total += 1
    res_cluster = post_json("/api/dispatch/cluster-manifest", {})
    print(f"\n[Test 6] Cluster Manifests:")
    print(f"  Generated: {res_cluster.get('totalManifestsGenerated')} manifests, Total Orders: {res_cluster.get('totalOrdersClustered')}")
    assert res_cluster.get("success") is True
    manifests = res_cluster.get("manifests", [])
    assert len(manifests) > 0
    for m in manifests:
        assert m.get("batchCount") <= 4, f"Manifest exceeds max 4 drops! Found {m.get('batchCount')}"
        assert "googleMapsUrl" in m and "google.com/maps/dir" in m["googleMapsUrl"]
        assert "whatsappShareText" in m and "DISPATCH MANIFEST" in m["whatsappShareText"]
        print(f"    - Manifest #{m.get('manifestId')}: Ward '{m.get('ward')}', {m.get('batchCount')} drops, {m.get('totalDistanceKm')}km, Rider: {m.get('rider', {}).get('name')}")
    passed += 1
    print("  -> PASS")

    # 7. Test 3-Minute Store Picker Packing Slip
    total += 1
    res_slip = get_json("/api/dispatch/packing-slip?orderId=WA-9401")
    print(f"\n[Test 7] 3-Minute Picker Packing Slip:")
    print(f"  Order: {res_slip.get('orderId')}, Tote: {res_slip.get('toteTag')}, SLA Target: {res_slip.get('pickerTargetTime')}")
    assert res_slip.get("success") is True
    items = res_slip.get("items", [])
    assert len(items) > 0
    for it in items:
        assert "shelfCode" in it and len(it["shelfCode"]) > 3
        assert "walkingOrder" in it
        print(f"    - [{it['shelfCode']}] {it['name']} (Qty: {it['quantity']}) - Zone: {it['zone']}")
    # Verify items are strictly sorted by walkingOrder
    seqs = [it["walkingOrder"] for it in items]
    assert seqs == sorted(seqs), "Picker items not sorted in optimal walking route order!"
    passed += 1
    print("  -> PASS")

    # 8. Test 80mm Thermal Printable Slip HTML
    total += 1
    html_slip = get_text("/api/dispatch/packing-slip/print?orderId=WA-9401")
    print(f"\n[Test 8] Printable Thermal Slip HTML:")
    assert "3-MINUTE PICKER SLA" in html_slip or "Store Picker Slip" in html_slip
    assert "RANI HYPER MARKET" in html_slip
    assert "80mm" in html_slip
    passed += 1
    print("  -> PASS")

    print("\n================================================================")
    print(f"  ALL {passed}/{total} DISPATCH ROUTER TESTS PASSED PERFECTLY!")
    print("================================================================")

if __name__ == "__main__":
    main()
