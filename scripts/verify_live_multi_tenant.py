#!/usr/bin/env python3
"""
scripts/verify_live_multi_tenant.py

Live production verification of Rani Hypermarket Multi-Tenant Architecture on Vercel:
Tests:
1. GET /api/multi-tenant/tenants (15 regional stores across Theni, Madurai, Dindigul)
2. GET /api/multi-tenant/catalog (Global Master FMCG Catalog)
3. GET /api/multi-tenant/inventory (Store-specific inventory with RLS)
4. GET /api/multi-tenant/transfers (Bilateral transfer visibility)
5. GET /api/multi-tenant/report (Executive network summary)
"""

import urllib.request
import json
import sys

BASE_URL = "https://rani-hyper-market.vercel.app"

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "LiveMultiTenantVerifier/1.0"})
    with urllib.request.urlopen(req, timeout=20) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def post(path, payload):
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json", "User-Agent": "LiveMultiTenantVerifier/1.0"})
    with urllib.request.urlopen(req, timeout=20) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def run_live_tests():
    print("=" * 70)
    print("LIVE PRODUCTION MULTI-TENANT VERIFICATION: https://rani-hyper-market.vercel.app")
    print("=" * 70)
    passed = 0
    total = 0

    # 1. Tenants API
    total += 1
    status, t_data = get("/api/multi-tenant/tenants")
    assert status == 200, f"Expected 200, got {status}"
    assert t_data["success"] is True
    tenants = t_data["tenants"]
    print(f"[LIVE TEST 1] GET /api/multi-tenant/tenants: Found {len(tenants)} regional stores.")
    assert len(tenants) == 15, f"Expected 15 regional stores, got {len(tenants)}"
    
    theni = [t for t in tenants if t["district"] == "Theni"]
    mdu = [t for t in tenants if t["district"] == "Madurai"]
    dgl = [t for t in tenants if t["district"] == "Dindigul"]
    assert len(theni) == 7 and len(mdu) == 4 and len(dgl) == 4
    bodi = next(t for t in tenants if t["storeCode"] == "RANI-THN-01")
    bodi_id = bodi["id"]
    print(f"  -> Theni: 7, Madurai: 4, Dindigul: 4. Flagship: {bodi['storeName']} ({bodi_id})")
    passed += 1

    # 2. Global Catalog API
    total += 1
    status, c_data = get("/api/multi-tenant/catalog")
    assert status == 200
    assert c_data["success"] is True
    items = c_data["items"]
    print(f"[LIVE TEST 2] GET /api/multi-tenant/catalog: {len(items)} global master items.")
    assert len(items) >= 10
    sample = items[0]
    assert "barcode" in sample and "hsnCode" in sample and "brandName" in sample
    print(f"  -> Sample Global Item: {sample['productName']} (Barcode: {sample['barcode']}, HSN: {sample['hsnCode']})")
    passed += 1

    # 3. Store Inventory API (RLS Enforced)
    total += 1
    status, inv_data = get(f"/api/multi-tenant/inventory?tenantId={bodi_id}")
    assert status == 200
    assert inv_data["success"] is True
    assert inv_data["rlsEnforced"] is True
    inv = inv_data["inventory"]
    val = inv_data["valuationSummary"]
    print(f"[LIVE TEST 3] GET /api/multi-tenant/inventory (Bodi Hub): {len(inv)} items.")
    print(f"  -> Retail: ₹{val['totalRetailValuationInr']:,.2f}, Wholesale: ₹{val['totalWholesaleCostInr']:,.2f}, Margin: {val['avgGrossMarginPct']}%")
    passed += 1

    # 4. Inventory Transfers API
    total += 1
    status, trf_data = get(f"/api/multi-tenant/transfers?tenantId={bodi_id}")
    assert status == 200
    assert trf_data["success"] is True
    transfers = trf_data["transfers"]
    print(f"[LIVE TEST 4] GET /api/multi-tenant/transfers: Found {len(transfers)} transfers involving Bodi Hub.")
    assert len(transfers) >= 1
    first_trf = transfers[0]
    print(f"  -> Transfer: {first_trf['transferNumber']} ({first_trf['status']}) - From: {first_trf['sourceStoreName']} To: {first_trf['destinationStoreName']}")
    passed += 1

    # 5. Network Executive Report
    total += 1
    status, rep_data = get("/api/multi-tenant/report")
    assert status == 200
    assert rep_data["success"] is True
    ov = rep_data["clusterOverview"]
    print(f"[LIVE TEST 5] GET /api/multi-tenant/report: Network Rollup")
    print(f"  -> Total Regional Supermarkets: {ov['totalRegionalSupermarkets']}")
    print(f"  -> Network Stock Units: {ov['totalNetworkStockUnits']:,}")
    print(f"  -> Inventory Valuation: ₹{ov['totalNetworkInventoryValuationInr']:,.2f}")
    assert ov["totalRegionalSupermarkets"] == 15
    passed += 1

    print("=" * 70)
    print(f"LIVE PRODUCTION MULTI-TENANT VERIFICATION: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 70)

if __name__ == "__main__":
    try:
        run_live_tests()
    except Exception as e:
        print(f"LIVE VERIFICATION FAILED: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
