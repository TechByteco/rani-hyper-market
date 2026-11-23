#!/usr/bin/env python3
"""
scripts/verify_consortium_procurement.py

Verification test suite for Centralized Group-Buying Procurement Consortium (15 Supermarkets):
1. Demand Aggregation: 14-day staple demand across 15 tenant stores (e.g. 42 MT Toor Dal).
2. Direct Mandi Bidding Terminal: Unified RFPs to Tirunelveli, Thanjavur, and Andhra Pradesh mills (6% to 9% discount).
3. Split Bills of Lading: Automated consignment splitting and 4 multi-drop direct delivery trucks.
4. Profit Margin Improvement: Per-store gross margin expansion and annualized collective savings.
"""

import urllib.request
import json
import sys

BASE_URL = "http://localhost:5500"

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "ConsortiumProcurementVerifier/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def run_tests():
    print("=" * 75)
    print("CENTRALIZED GROUP-BUYING CONSORTIUM PROCUREMENT VERIFICATION TEST SUITE")
    print("=" * 75)
    passed = 0
    total = 0

    # -------------------------------------------------------------
    # TEST 1: 14-Day Demand Aggregation across 15 Supermarkets
    # -------------------------------------------------------------
    total += 1
    status, d_data = get("/api/consortium/demand")
    assert status == 200, f"Expected 200, got {status}"
    assert d_data["success"] is True
    print(f"[TEST 1] GET /api/consortium/demand: 14-Day Collective Staple Aggregation")
    print(f"  -> Total Member Supermarkets: {d_data['totalSupermarkets']}")
    print(f"  -> Total Staple Commodities: {d_data['totalCommodityCount']}")
    print(f"  -> Total Consortium Volume: {d_data['totalConsortiumDemandMt']} Metric Tons")
    print(f"  -> Overall Consortium Discount: {d_data['overallConsortiumDiscountPct']}%")
    print(f"  -> 14-Day Cost Savings: ₹{d_data['total14DayConsortiumSavingsInr']:,}")
    print(f"  -> Annualized Savings: ₹{d_data['annualizedProjectedSavingsInr']:,}")

    assert d_data["totalSupermarkets"] == 15, f"Expected 15 stores, got {d_data['totalSupermarkets']}"
    assert 6.0 <= d_data["overallConsortiumDiscountPct"] <= 9.0, f"Expected discount 6-9%, got {d_data['overallConsortiumDiscountPct']}%"
    
    # Verify User Requirement: Total Toor Dal demand: 42 Metric Tons
    toor = next(c for c in d_data["commodities"] if "Toor Dal" in c["commodityName"])
    print(f"  -> Verified Toor Dal Demand: {toor['totalDemandMt']} MT ({toor['totalDemandKg']:,} kg)")
    assert toor["totalDemandMt"] == 42.0, f"Expected 42.0 MT Toor Dal, got {toor['totalDemandMt']}"
    assert len(toor["storeBreakdown"]) == 15, f"Expected 15 store allocations, got {len(toor['storeBreakdown'])}"
    print(f"  -> Toor Dal Direct Mill Savings: ₹{toor['totalSavingsInr']:,} ({toor['negotiatedDiscountPct']}% below distributor rate)")
    passed += 1

    # -------------------------------------------------------------
    # TEST 2: Direct Mandi Bidding Terminal & Unified RFPs
    # -------------------------------------------------------------
    total += 1
    status, rfp_data = get("/api/consortium/rfp")
    assert status == 200, f"Expected 200, got {status}"
    assert rfp_data["success"] is True
    tenders = rfp_data["rfpTenders"]
    print(f"[TEST 2] GET /api/consortium/rfp: Direct Mandi Bidding Terminal ({len(tenders)} RFPs)")
    
    # Check origin zones in Tirunelveli, Thanjavur, and Andhra Pradesh
    zones = rfp_data["originZonesCovered"]
    print(f"  -> Origin Zones: {', '.join(zones)}")
    assert any("Tirunelveli" in z for z in zones)
    assert any("Thanjavur" in z for z in zones)
    assert any("Andhra Pradesh" in z for z in zones)

    # Validate each tender negotiates 6% to 9% below single-store distributor rates
    for t in tenders:
        discount = t["negotiatedDiscountPct"]
        print(f"  -> RFP {t['rfpNumber']} ({t['commodityName']}): {discount}% discount from {t['awardedMillName']} ({t['awardedMillOrigin']})")
        assert 6.0 <= discount <= 9.0, f"Discount {discount}% is outside the 6% to 9% requirement"
        assert t["biddingStatus"] == "CONTRACT_AWARDED"
    passed += 1

    # -------------------------------------------------------------
    # TEST 3: Split Bills of Lading & Direct Truck Multi-Drop Logistics
    # -------------------------------------------------------------
    total += 1
    status, bol_data = get("/api/consortium/bol-split?commodityId=COMM-TOOR-DAL-A")
    assert status == 200, f"Expected 200, got {status}"
    assert bol_data["success"] is True
    m_bol = bol_data["masterBillOfLading"]
    print(f"[TEST 3] GET /api/consortium/bol-split: Master Bill of Lading {m_bol['masterBolNumber']}")
    print(f"  -> Mill Origin: {m_bol['originMillName']} ({m_bol['originMillLocation']})")
    print(f"  -> Total Consignment: {m_bol['totalConsignmentWeightMt']} MT ({m_bol['totalConsignmentWeightKg']:,} kg)")
    print(f"  -> Mill Rate: ₹{m_bol['directMillRatePerKg']}/kg | Value: ₹{m_bol['totalMasterInvoiceInr']:,}")
    print(f"  -> Direct Trucks Dispatched: {bol_data['totalTrucksDispatched']} Direct Multi-Drop Routes")
    assert m_bol["totalConsignmentWeightMt"] == 42.0

    trucks = bol_data["truckDispatches"]
    assert len(trucks) == 4, f"Expected 4 routes, got {len(trucks)}"
    total_drops = sum(len(t["multiDropSequence"]) for t in trucks)
    assert total_drops == 15, f"Expected 15 sub-bill drops, got {total_drops}"
    
    # Check Route Alpha (Theni Core)
    alpha = next(t for t in trucks if "Route Alpha" in t["routeName"])
    print(f"  -> {alpha['routeName']}: Vehicle {alpha['vehicleRegistrationNumber']} ({alpha['driverName']}), Load: {alpha['totalTruckLoadMt']} MT across {len(alpha['multiDropSequence'])} store drops.")
    first_sub_bol = alpha["multiDropSequence"][0]
    assert "subBolNumber" in first_sub_bol
    assert "eWayBillNumber" in first_sub_bol
    assert first_sub_bol["allocatedVolumeKg"] > 0
    passed += 1

    # -------------------------------------------------------------
    # TEST 4: Per-Store Net Profit Margin Improvements
    # -------------------------------------------------------------
    total += 1
    status, m_data = get("/api/consortium/margins")
    assert status == 200, f"Expected 200, got {status}"
    assert m_data["success"] is True
    rankings = m_data["storeRankings"]
    print(f"[TEST 4] GET /api/consortium/margins: Store Margin Expansion Analysis ({len(rankings)} stores)")
    print(f"  -> Average Network Margin Expansion: +{m_data['averageGrossMarginExpansionPct']}%")
    print(f"  -> 14-Day Network Cost Savings: ₹{m_data['totalNetwork14DaySavingsInr']:,}")
    print(f"  -> Monthly Projected Savings: ₹{m_data['totalNetworkMonthlySavingsInr']:,}")
    print(f"  -> Annualized Collective Gain: ₹{m_data['totalNetworkAnnualizedSavingsInr']:,}")
    assert len(rankings) == 15
    assert m_data["averageGrossMarginExpansionPct"] >= 6.0

    # Print Top 3 and Bottom 2 Stores
    top_store = rankings[0]
    print(f"  -> Top Beneficiary: {top_store['storeName']} ({top_store['city']})")
    print(f"     * Old Margin: {top_store['oldGrossMarginPct']}% ➔ New Consortium Margin: {top_store['consortiumGrossMarginPct']}% (+{top_store['netMarginExpansionPct']}%)")
    print(f"     * 14-Day Savings: ₹{top_store['net14DaySavingsInr']:,} (Annual: ₹{top_store['annualizedSavingsInr']:,})")
    
    bottom_store = rankings[-1]
    print(f"  -> Small Express Store: {bottom_store['storeName']} ({bottom_store['city']})")
    print(f"     * Old Margin: {bottom_store['oldGrossMarginPct']}% ➔ New Consortium Margin: {bottom_store['consortiumGrossMarginPct']}% (+{bottom_store['netMarginExpansionPct']}%)")
    print(f"     * 14-Day Savings: ₹{bottom_store['net14DaySavingsInr']:,} (Annual: ₹{bottom_store['annualizedSavingsInr']:,})")
    passed += 1

    print("=" * 75)
    print(f"CENTRALIZED GROUP-BUYING CONSORTIUM PROCUREMENT VERIFICATION COMPLETED: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 75)

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"VERIFICATION FAILED: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
