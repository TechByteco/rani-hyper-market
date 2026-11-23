#!/usr/bin/env python3
"""
scripts/verify_multi_tenant_architecture.py

Comprehensive verification test suite for Rani Hypermarket Multi-Tenant Architecture:
1. 15 Regional Supermarkets across Theni, Madurai, and Dindigul districts.
2. Shared Database with Row-Level Security (RLS) isolation logic.
3. Global Master FMCG Catalog (standardized barcodes, HSN, brand) vs Store-Specific Inventory (selling price, cost, shelf location, stock).
4. Inter-store inventory transfer workflow (Bodinayakanur Mother Warehouse -> Theni/Madurai branches).
5. Multi-Tenant regional rollup analytics.
"""

import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://localhost:5500"

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "MultiTenantVerifier/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def post(path, payload):
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json", "User-Agent": "MultiTenantVerifier/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def run_tests():
    print("=" * 70)
    print("RANI HYPERMARKET MULTI-TENANT ARCHITECTURE VERIFICATION TEST SUITE")
    print("=" * 70)
    passed = 0
    total = 0

    # 1. Test GET /api/tenants - All 15 Regional Supermarkets
    total += 1
    status, data = get("/api/tenants")
    assert status == 200, f"Expected 200, got {status}"
    assert data["success"] is True
    stores = data["tenants"]
    print(f"[TEST 1] GET /api/tenants: Found {len(stores)} regional stores.")
    assert len(stores) == 15, f"Expected 15 stores, found {len(stores)}"
    
    # Verify District Breakdown: Theni (7), Madurai (4), Dindigul (4)
    theni_stores = [s for s in stores if s["district"] == "Theni"]
    madurai_stores = [s for s in stores if s["district"] == "Madurai"]
    dindigul_stores = [s for s in stores if s["district"] == "Dindigul"]
    assert len(theni_stores) == 7, f"Expected 7 Theni stores, got {len(theni_stores)}"
    assert len(madurai_stores) == 4, f"Expected 4 Madurai stores, got {len(madurai_stores)}"
    assert len(dindigul_stores) == 4, f"Expected 4 Dindigul stores, got {len(dindigul_stores)}"
    
    # Check Bodinayakanur flagship
    bodi = next(s for s in stores if s["storeCode"] == "RANI-THN-01")
    assert bodi["isWarehouse"] is True
    assert "Flagship" in bodi["storeName"]
    bodi_id = bodi.get("tenantId") or bodi.get("id")
    print(f"  -> Bodinayakanur Flagship Hub verified (tenantId: {bodi_id}, area: {bodi['totalAreaSqFt']} sqft)")
    print(f"  -> Theni: {len(theni_stores)} stores, Madurai: {len(madurai_stores)} stores, Dindigul: {len(dindigul_stores)} stores.")
    passed += 1

    # 2. Test GET /api/tenants?district=Madurai
    total += 1
    status, mdu_data = get("/api/tenants?district=Madurai")
    assert status == 200
    assert len(mdu_data["tenants"]) == 4
    mattuthavani = next(s for s in mdu_data["tenants"] if s["storeCode"] == "RANI-MDU-02")
    assert mattuthavani["isWarehouse"] is True
    mdu_hub_id = mattuthavani.get("tenantId") or mattuthavani.get("id")
    print(f"[TEST 2] GET /api/tenants?district=Madurai: Verified 4 Madurai stores with Mattuthavani Secondary Hub ({mdu_hub_id}).")
    passed += 1

    # 3. Test GET /api/catalog/global - Global Master FMCG Catalog
    total += 1
    status, cat_data = get("/api/catalog/global")
    assert status == 200
    assert cat_data["success"] is True
    catalog = cat_data["items"]
    print(f"[TEST 3] GET /api/catalog/global: Retrieved {len(catalog)} standardized FMCG master products.")
    assert len(catalog) >= 10
    first_item = catalog[0]
    assert "barcode" in first_item
    assert "hsnCode" in first_item
    assert "gstRate" in first_item
    assert "brandName" in first_item
    
    # Search within global catalog
    status, search_data = get("/api/catalog/global?search=Rice")
    assert status == 200
    assert len(search_data["items"]) >= 1
    print(f"  -> Filter search 'Rice' matched: {search_data['items'][0]['productName']} (Barcode: {search_data['items'][0]['barcode']})")
    passed += 1

    # 4. Test GET /api/inventory/store - Tenant Row-Level Security Isolation
    total += 1
    status, inv_data = get(f"/api/inventory/store?tenantId={bodi_id}")
    assert status == 200
    assert inv_data["success"] is True
    bodi_inv = inv_data["inventory"]
    val = inv_data["valuationSummary"]
    print(f"[TEST 4] GET /api/inventory/store (Bodi Hub): {len(bodi_inv)} isolated SKUs.")
    print(f"  -> Retail Valuation: ₹{val['totalRetailValuationInr']:,.2f}, Wholesale Cost: ₹{val['totalWholesaleCostInr']:,.2f}, Gross Margin: {val['avgGrossMarginPct']}%")
    assert val["avgGrossMarginPct"] > 0
    assert len(bodi_inv) >= 10
    
    # Check store-specific fields
    sample = bodi_inv[0]
    assert "sellingPrice" in sample
    assert "wholesaleLandedCost" in sample
    assert "localShelfLocation" in sample
    assert "currentStockUnits" in sample
    bodi_rice_item = next(i for i in bodi_inv if "Rice" in i["productName"])
    bodi_initial_rice_stock = bodi_rice_item["currentStockUnits"]
    rice_global_sku_id = bodi_rice_item["globalSkuId"]
    passed += 1

    # 5. Test Branch Tenant Store Inventory (Theni Main Bazaar)
    total += 1
    theni_store = next(s for s in stores if s["storeCode"] == "RANI-THN-02")
    theni_id = theni_store.get("tenantId") or theni_store.get("id")
    status, theni_inv_data = get(f"/api/inventory/store?tenantId={theni_id}")
    assert status == 200
    theni_inv = theni_inv_data["inventory"]
    theni_initial_rice_stock = next((i["currentStockUnits"] for i in theni_inv if "Rice" in i["productName"]), 0)
    print(f"[TEST 5] Branch Store Inventory (Theni Main Bazaar): {len(theni_inv)} SKUs.")
    print(f"  -> Bodinayakanur Rice Stock: {bodi_initial_rice_stock} units vs Theni Rice Stock: {theni_initial_rice_stock} units.")
    passed += 1

    # 6. Test Multi-Store Inventory Transfer: Bodinayakanur -> Theni
    total += 1
    transfer_payload = {
        "sourceTenantId": bodi_id,
        "destinationTenantId": theni_id,
        "driverName": "Murugan K.",
        "vehicleNumber": "TN-60-AZ-4512",
        "notes": "Weekly replenishment of Ponni Rice & Sunflower Oil from Bodi Central Hub",
        "items": [
            {
                "globalSkuId": rice_global_sku_id,
                "requestedQuantity": 25,
                "unitCost": 1180.00
            }
        ]
    }
    status, trf_res = post("/api/transfers/create", transfer_payload)
    assert status == 200, f"Expected 200, got {status}: {trf_res}"
    assert trf_res["success"] is True
    transfer = trf_res["transfer"]
    transfer_id = transfer["id"]
    transfer_no = transfer["transferNumber"]
    assert transfer["status"] == "IN_TRANSIT"
    print(f"[TEST 6] POST /api/transfers/create: Dispatched Transfer {transfer_no} ({transfer_id})")
    print(f"  -> Status: {transfer['status']}, Items: {len(transfer['items'])}, Value: ₹{transfer['totalTransferValue']:,.2f}")
    
    # Verify source inventory decremented
    status, bodi_inv_after = get(f"/api/inventory/store?tenantId={bodi_id}")
    bodi_rice_after = next(i["currentStockUnits"] for i in bodi_inv_after["inventory"] if "Rice" in i["productName"])
    assert bodi_rice_after == bodi_initial_rice_stock - 25, f"Expected {bodi_initial_rice_stock - 25}, got {bodi_rice_after}"
    print(f"  -> Bodinayakanur stock correctly decremented: {bodi_initial_rice_stock} -> {bodi_rice_after} units (-25 units).")
    passed += 1

    # 7. Test Bilateral Transfer Visibility
    total += 1
    status, bodi_trfs = get(f"/api/transfers?tenantId={bodi_id}")
    assert any(t["id"] == transfer_id for t in bodi_trfs["transfers"])
    status, theni_trfs = get(f"/api/transfers?tenantId={theni_id}")
    assert any(t["id"] == transfer_id for t in theni_trfs["transfers"])
    print(f"[TEST 7] Bilateral RLS Visibility: Transfer {transfer_no} visible to both Source (Bodi) and Destination (Theni).")
    passed += 1

    # 8. Test Confirm Receipt at Destination Store
    total += 1
    receive_payload = {
        "transferId": transfer_id,
        "notes": "Verified all 25 sacks of Rice received in pristine condition at Theni Main Bazaar dock."
    }
    status, rcv_res = post("/api/transfers/receive", receive_payload)
    assert status == 200, f"Expected 200, got {status}: {rcv_res}"
    assert rcv_res["success"] is True
    rcv_trf = rcv_res["transfer"]
    assert rcv_trf["status"] == "RECEIVED"
    
    # Verify destination inventory incremented
    status, theni_inv_after = get(f"/api/inventory/store?tenantId={theni_id}")
    theni_rice_after = next(i["currentStockUnits"] for i in theni_inv_after["inventory"] if "Rice" in i["productName"])
    assert theni_rice_after == theni_initial_rice_stock + 25, f"Expected {theni_initial_rice_stock + 25}, got {theni_rice_after}"
    print(f"[TEST 8] POST /api/transfers/receive: Confirmed receipt for {transfer_no}.")
    print(f"  -> Destination (Theni) stock incremented: {theni_initial_rice_stock} -> {theni_rice_after} units (+25 units).")
    passed += 1

    # 9. Test Multi-Tenant Regional Rollup Summary Report
    total += 1
    status, report_data = get("/api/multi-tenant/report")
    assert status == 200
    assert report_data["success"] is True
    ov = report_data["clusterOverview"]
    print(f"[TEST 9] GET /api/multi-tenant/report: Regional Rollup Report")
    print(f"  -> Total Regional Stores: {ov['totalRegionalSupermarkets']}")
    print(f"  -> Districts Covered: {', '.join(ov['districtsCovered'])}")
    print(f"  -> Global Master Catalog SKUs: {ov['globalMasterSkusCount']}")
    print(f"  -> Total Network Inventory Units: {ov['totalNetworkStockUnits']:,}")
    print(f"  -> Network Inventory Valuation: ₹{ov['totalNetworkInventoryValuationInr']:,.2f}")
    assert ov["totalRegionalSupermarkets"] == 15
    assert "districtBreakdown" in report_data
    assert "Theni" in report_data["districtBreakdown"]
    assert "Madurai" in report_data["districtBreakdown"]
    assert "Dindigul" in report_data["districtBreakdown"]
    passed += 1

    print("=" * 70)
    print(f"MULTI-TENANT ARCHITECTURE VERIFICATION COMPLETED: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 70)

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"VERIFICATION FAILED: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
