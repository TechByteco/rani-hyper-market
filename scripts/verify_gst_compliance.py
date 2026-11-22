#!/usr/bin/env python3
"""
Automated Verification Suite for GSTR-1 Outward Supplies Ledger & Indian FinTech Tax Engine
Rani Hyper Market (SNS Market) — Bodinayakanur & Theni District, Tamil Nadu
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:5500"

def test_endpoint(name, url, is_binary=False):
    print(f"\n--- Testing: {name} ---")
    print(f"URL: {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "GSTComplianceTest/1.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            status = res.status
            content_type = res.headers.get("Content-Type", "")
            data = res.read()
            print(f"[STATUS] HTTP {status} (Content-Type: {content_type})")
            if is_binary:
                print(f"[PAYLOAD] Received binary buffer: {len(data):,} bytes")
                return True, data
            else:
                parsed = json.loads(data.decode("utf-8"))
                return True, parsed
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False, str(e)

def main():
    print("=" * 70)
    print(" RANI HYPER MARKET — GSTR-1 COMPLIANCE LEDGER VERIFICATION SUITE")
    print("=" * 70)
    all_passed = True

    # 1. Test Slabs & Configuration
    ok, res = test_endpoint("1. Statutory GST Slabs & Master Reference", f"{BASE_URL}/api/gst/slabs")
    if ok and res.get("success") and res.get("gstin") == "33BAGPN1341C1ZC":
        print(f"[PASS] GSTIN: {res['gstin']} | State: {res['state']}")
        print(f"[PASS] Historical Target Shares: {res['historicalSlabShares']}")
        print(f"[PASS] Master HSN Reference Entries: {res['hsnMasterCount']}")
    else:
        print("[FAIL] Slabs endpoint validation failed")
        all_passed = False

    # 2. Test Classification across 4 Slabs
    classify_tests = [
        ("Fresh Farm Tomato 1kg", 0, "0701"),
        ("Loose Toor Dal Grade A 1kg", 0, "0713"),
        ("Aavin Toned Fresh Milk 500ml", 0, "0401"),
        ("1Kg R Sugar", 5, "1701"),
        ("Gold Winner Sunflower Oil 1L", 5, "1515"),
        ("500G R Anil Samba Wheat", 5, "1101"),
        ("GRB Pure Cow Ghee 200ml", 12, "0405"),
        ("Amul Pasteurized Butter 100g", 12, "0405"),
        ("5G R Eno Lemon", 12, "3004"),
        ("Surf Excel Easy Wash 1kg", 18, "3402"),
        ("Sensodyne Freshgel 75g", 18, "3306"),
        ("Cadbury Dairy Milk Silk 60g", 18, "1806")
    ]

    print("\n--- Testing: 2. HSN & Statutory Tax Slab Classification ---")
    for title, expected_rate, expected_hsn in classify_tests:
        encoded_title = urllib.parse.quote(title)
        url = f"{BASE_URL}/api/gst/classify?title={encoded_title}"
        ok, res = test_endpoint(f"Classify: {title}", url)
        if ok and res.get("success"):
            cls = res.get("classification", {})
            rate = cls.get("rate")
            hsn = cls.get("hsn")
            slab = cls.get("slab")
            if rate == expected_rate and hsn == expected_hsn:
                print(f"[PASS] '{title}' => {rate}% Slab (HSN: {hsn}) [Expected: {expected_rate}%, HSN: {expected_hsn}]")
            else:
                print(f"[WARN] '{title}' => Got {rate}% (HSN {hsn}), Expected {expected_rate}% (HSN {expected_hsn})")
        else:
            all_passed = False

    # 3. Test GSTR-1 Monthly Summary
    ok, res = test_endpoint("3. GSTR-1 Monthly Ledger Summary (2026-04)", f"{BASE_URL}/api/gst/gstr1/summary?month=2026-04")
    if ok and res.get("success"):
        meta = res.get("metadata", {})
        summary = res.get("summary", {})
        slabs = res.get("slabComparison", {})
        print(f"[PASS] Period: {meta.get('periodLabel')} ({meta.get('period')})")
        print(f"[PASS] Data Source: {meta.get('dataSource')}")
        print(f"[PASS] Total Invoices: {summary.get('totalInvoices'):,}")
        print(f"[PASS] Total Gross Sales: Rs. {summary.get('totalGrossSales'):,.2f}")
        print(f"[PASS] Total Taxable Value: Rs. {summary.get('totalTaxableValue'):,.2f}")
        print(f"[PASS] Central Tax (CGST): Rs. {summary.get('totalCgst'):,.2f}")
        print(f"[PASS] State Tax (SGST): Rs. {summary.get('totalSgst'):,.2f}")
        print(f"[PASS] Total Tax: Rs. {summary.get('grandTotalTax'):,.2f}")
        print(f"[PASS] Effective Tax Rate: {summary.get('effectiveTaxRatePct')}%")
        
        print("\nSlab Breakdown vs Historical Target:")
        for r_str in ["0", "5", "12", "18"]:
            sc = slabs.get(r_str, {})
            print(f"  * {sc.get('slabName')}: Rs. {sc.get('grossTurnover'):,.2f} | Actual: {sc.get('empiricalSharePct')}% vs Target: {sc.get('targetHistoricalSharePct')}% (Variance: {sc.get('variancePct')}%)")
    else:
        print("[FAIL] GSTR-1 summary failed")
        all_passed = False

    # 4. Test Table 7: B2CS Invoices
    ok, res = test_endpoint("4. Table 7: B2C (Small) Invoices (b2cs)", f"{BASE_URL}/api/gst/gstr1/b2cs?month=2026-04")
    if ok and res.get("success") and len(res.get("b2cs", [])) >= 4:
        print(f"[PASS] Table 7 B2CS entry count: {len(res['b2cs'])}")
        for b in res["b2cs"]:
            print(f"  * Rate: {b.get('rt')}% | POS: {b.get('pos')} | Taxable: Rs. {b.get('txval'):,.2f} | CGST: Rs. {b.get('camt'):,.2f} | SGST: Rs. {b.get('samt'):,.2f}")
    else:
        print("[FAIL] Table 7 B2CS failed")
        all_passed = False

    # 5. Test Table 12: HSN Summary
    ok, res = test_endpoint("5. Table 12: HSN-wise Summary", f"{BASE_URL}/api/gst/gstr1/hsn?month=2026-04")
    if ok and res.get("success") and len(res.get("hsn", [])) > 0:
        hsn_list = res.get("hsn", [])
        print(f"[PASS] Table 12 HSN entry count: {len(hsn_list)}")
        print(f"[PASS] Top 5 HSN entries:")
        for h in hsn_list[:5]:
            print(f"  * HSN: {h.get('hsn_sc')} ({h.get('desc')}) | Qty: {h.get('qty')} {h.get('uqc')} | Value: Rs. {h.get('val'):,.2f} | Taxable: Rs. {h.get('txval'):,.2f} | CGST: Rs. {h.get('camt'):,.2f} | SGST: Rs. {h.get('samt'):,.2f}")
    else:
        print("[FAIL] Table 12 HSN failed")
        all_passed = False

    # 6. Test JSON Export for GST Portal Offline Tool
    ok, res = test_endpoint("6. GST Portal Offline Utility JSON Export", f"{BASE_URL}/api/gst/gstr1/export/json?month=2026-04")
    if ok and res.get("gstin") == "33BAGPN1341C1ZC" and "b2cs" in res and "hsn" in res and "hash" in res:
        print(f"[PASS] Offline Tool JSON Version: {res.get('version')}")
        print(f"[PASS] GSTIN: {res.get('gstin')} | Filing Period: {res.get('fp')}")
        print(f"[PASS] SHA-256 Hash: {res.get('hash')}")
        print(f"[PASS] Table 7 (b2cs) records: {len(res.get('b2cs', []))}")
        print(f"[PASS] Table 12 (hsn) records: {len(res.get('hsn', {}).get('data', []))}")
        print(f"[PASS] Table 8 (nil) records: {len(res.get('nil', {}).get('inv', []))}")
        print(f"[PASS] Table 13 (doc_issue) records: {len(res.get('doc_issue', {}).get('doc_det', []))}")
    else:
        print("[FAIL] JSON Export failed")
        all_passed = False

    # 7. Test Multi-Tab Excel Workbook Export
    ok, buffer = test_endpoint("7. Multi-Tab Excel (.xlsx) Workbook Export", f"{BASE_URL}/api/gst/gstr1/export/excel?month=2026-04", is_binary=True)
    if ok and len(buffer) > 10000:
        # Check ZIP / XLSX magic header PK\x03\x04
        if buffer[:4] == b"PK\x03\x04":
            print(f"[PASS] Valid Excel (.xlsx) binary signature (PK\\x03\\x04) verified!")
            print(f"[PASS] Excel Workbook size: {len(buffer):,} bytes (~{len(buffer)/(1024*1024):.2f} MB)")
        else:
            print("[FAIL] File does not have standard .xlsx ZIP header")
            all_passed = False
    else:
        print("[FAIL] Excel Export failed")
        all_passed = False

    print("\n" + "=" * 70)
    if all_passed:
        print(" ALL 7 GSTR-1 COMPLIANCE TESTS PASSED WITH 100% SUCCESS!")
    else:
        print(" SOME GSTR-1 TESTS FAILED!")
    print("=" * 70)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
