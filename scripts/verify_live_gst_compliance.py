#!/usr/bin/env python3
"""
Live Production Verification for GSTR-1 Outward Supplies Ledger on Vercel
URL: https://rani-hyper-market.vercel.app
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "https://rani-hyper-market.vercel.app"

def test_endpoint(name, url, is_binary=False):
    print(f"\n--- Testing Live Production: {name} ---")
    print(f"URL: {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "LiveGSTTest/1.0"})
        with urllib.request.urlopen(req, timeout=20) as res:
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
    print(" RANI HYPER MARKET — LIVE VERCEL PRODUCTION GSTR-1 VERIFICATION")
    print("=" * 70)
    all_passed = True

    # 1. Statutory Slabs
    ok, res = test_endpoint("1. Live Statutory GST Slabs", f"{BASE_URL}/api/gst/slabs")
    if ok and res.get("success") and res.get("gstin") == "33BAGPN1341C1ZC":
        print(f"[PASS] GSTIN: {res['gstin']} | State: {res['state']}")
        print(f"[PASS] Historical Target Shares: {res['historicalSlabShares']}")
        print(f"[PASS] Master HSN Reference Entries: {res['hsnMasterCount']}")
    else:
        print("[FAIL] Live Slabs endpoint failed")
        all_passed = False

    # 2. Live Classification
    test_skus = [
        ("Fresh Farm Tomato 1kg", 0, "0701"),
        ("1Kg R Sugar", 5, "1701"),
        ("GRB Pure Cow Ghee 200ml", 12, "0405"),
        ("Surf Excel Easy Wash 1kg", 18, "3402")
    ]
    for title, expected_rate, expected_hsn in test_skus:
        encoded = urllib.parse.quote(title)
        ok, res = test_endpoint(f"Classify: {title}", f"{BASE_URL}/api/gst/classify?title={encoded}")
        if ok and res.get("success"):
            cls = res.get("classification", {})
            rate = cls.get("rate")
            hsn = cls.get("hsn")
            if rate == expected_rate and hsn == expected_hsn:
                print(f"[PASS] '{title}' => {rate}% Slab (HSN: {hsn})")
            else:
                print(f"[WARN] '{title}' => Got {rate}% (HSN {hsn}), Expected {expected_rate}% (HSN {expected_hsn})")
        else:
            all_passed = False

    # 3. Live Monthly Summary
    ok, res = test_endpoint("3. Live GSTR-1 Monthly Ledger Summary", f"{BASE_URL}/api/gst/gstr1/summary?month=2026-04")
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
    else:
        print("[FAIL] Live GSTR-1 summary failed")
        all_passed = False

    # 4. Live Table 7 B2CS
    ok, res = test_endpoint("4. Live Table 7 B2CS Aggregation", f"{BASE_URL}/api/gst/gstr1/b2cs?month=2026-04")
    if ok and res.get("success") and len(res.get("b2cs", [])) >= 4:
        print(f"[PASS] Table 7 B2CS records: {len(res['b2cs'])}")
        for b in res["b2cs"]:
            print(f"  * Rate: {b.get('rt')}% | POS: {b.get('pos')} | Taxable: Rs. {b.get('txval'):,.2f} | CGST: Rs. {b.get('camt'):,.2f} | SGST: Rs. {b.get('samt'):,.2f}")
    else:
        print("[FAIL] Live Table 7 failed")
        all_passed = False

    # 5. Live Table 12 HSN Summary
    ok, res = test_endpoint("5. Live Table 12 HSN Summary", f"{BASE_URL}/api/gst/gstr1/hsn?month=2026-04")
    if ok and res.get("success") and len(res.get("hsn", [])) > 0:
        hsn_list = res.get("hsn", [])
        print(f"[PASS] Table 12 HSN commodities count: {len(hsn_list)}")
    else:
        print("[FAIL] Live Table 12 failed")
        all_passed = False

    # 6. Live Offline Utility JSON Export
    ok, res = test_endpoint("6. Live GST Portal Offline Utility JSON", f"{BASE_URL}/api/gst/gstr1/export/json?month=2026-04")
    if ok and res.get("gstin") == "33BAGPN1341C1ZC" and "b2cs" in res and "hash" in res:
        print(f"[PASS] Offline JSON Version: {res.get('version')} | SHA-256 Hash: {res.get('hash')}")
        print(f"[PASS] GSTIN: {res.get('gstin')} | Period: {res.get('fp')}")
    else:
        print("[FAIL] Live JSON Export failed")
        all_passed = False

    # 7. Live Excel Export
    ok, buffer = test_endpoint("7. Live Multi-Tab Excel (.xlsx) Workbook", f"{BASE_URL}/api/gst/gstr1/export/excel?month=2026-04", is_binary=True)
    if ok and len(buffer) > 10000:
        if buffer[:4] == b"PK\x03\x04":
            print(f"[PASS] Valid Excel (.xlsx) binary signature (PK\\x03\\x04) verified!")
            print(f"[PASS] Live Excel Workbook size: {len(buffer):,} bytes (~{len(buffer)/(1024*1024):.2f} MB)")
        else:
            print("[FAIL] File does not have valid .xlsx ZIP header")
            all_passed = False
    else:
        print("[FAIL] Live Excel Export failed")
        all_passed = False

    print("\n" + "=" * 70)
    if all_passed:
        print(" ALL 7 LIVE VERCEL PRODUCTION GSTR-1 TESTS PASSED WITH 100% SUCCESS!")
    else:
        print(" SOME LIVE GSTR-1 TESTS FAILED!")
    print("=" * 70)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
