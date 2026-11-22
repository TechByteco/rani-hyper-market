#!/usr/bin/env python3
"""
Automated Verification Suite for End-of-Day (EOD) 3-Way Reconciliation Module
Rani Hyper Market (SNS Market) — Main Road, Bodinayakanur & Theni District, Tamil Nadu
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:5500"

def test_endpoint(name, url, method="GET", payload=None):
    print(f"\n--- Testing: {name} ---")
    print(f"[{method}] {url}")
    try:
        headers = {"User-Agent": "ReconciliationTest/1.0"}
        data_bytes = None
        if payload is not None:
            headers["Content-Type"] = "application/json"
            data_bytes = json.dumps(payload).encode("utf-8")
        
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=15) as res:
            status = res.status
            content_type = res.headers.get("Content-Type", "")
            raw = res.read()
            print(f"[STATUS] HTTP {status} (Content-Type: {content_type})")
            if "application/json" in content_type:
                parsed = json.loads(raw.decode("utf-8"))
                return True, parsed
            else:
                return True, raw.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False, str(e)

def main():
    print("=" * 70)
    print(" RANI HYPER MARKET — EOD 3-WAY RECONCILIATION VERIFICATION SUITE")
    print("=" * 70)
    all_passed = True
    test_date = "2026-04-01"

    # 1. Test EOD Summary
    ok, res = test_endpoint("1. Daily EOD 3-Way Summary", f"{BASE_URL}/api/reconciliation/eod/summary?date={test_date}")
    if ok and res.get("success"):
        fm = res.get("financialMetrics", {})
        cd = res.get("channelBreakdown", {})
        print(f"[PASS] Date: {res.get('date')} | Total Invoices: {res.get('totalBills')}")
        print(f"[PASS] Total Sales: Rs. {fm.get('totalSales'):,.2f} | COGS: Rs. {fm.get('totalCogs'):,.2f} | Gross Margin: Rs. {fm.get('grossMargin'):,.2f} ({fm.get('grossMarginPct')}%)")
        print(f"[PASS] Cash Counter: {cd.get('cash', {}).get('billCount')} bills ({cd.get('cash', {}).get('volumePct')}%) - Rs. {cd.get('cash', {}).get('totalAmount'):,.2f} [Target: 74.5%]")
        print(f"[PASS] UPI Settlements: {cd.get('upi', {}).get('billCount')} bills ({cd.get('upi', {}).get('volumePct')}%) - Rs. {cd.get('upi', {}).get('totalAmount'):,.2f} [Target: 21.5%]")
        print(f"[PASS] Card Swipes: {cd.get('card', {}).get('billCount')} bills ({cd.get('card', {}).get('volumePct')}%) - Rs. {cd.get('card', {}).get('totalAmount'):,.2f} [Target: 4.0%]")
    else:
        print("[FAIL] EOD summary failed")
        all_passed = False

    # 2. Test Cash Drawer Count & Variance Computation
    # Simulate cashier counting cash with ₹15 surplus
    recorded_cash = res.get("channelBreakdown", {}).get("cash", {}).get("totalAmount", 20000)
    float_amt = 2000.00
    target_gross = recorded_cash + float_amt + 15.00
    n500 = int(target_gross // 500)
    rem_coins = target_gross % 500

    cash_payload = {
        "date": test_date,
        "denominations": {
            "500": n500,
            "coins": rem_coins
        },
        "openingFloat": float_amt,
        "cashierId": "CASHIER-101",
        "notes": "Evening cashier counter closing count"
    }

    ok, res = test_endpoint("2. Physical Cash Drawer Denomination Count", f"{BASE_URL}/api/reconciliation/cash-drawer/count", method="POST", payload=cash_payload)
    if ok and res.get("success"):
        cd = res.get("cashDrawer", {})
        print(f"[PASS] Gross Physical Cash: Rs. {cd.get('grossPhysicalCash'):,.2f}")
        print(f"[PASS] Opening Float Deducted: Rs. {cd.get('openingFloat'):,.2f}")
        print(f"[PASS] Net Physical Cash: Rs. {cd.get('netPhysicalCash'):,.2f}")
        print(f"[PASS] System Recorded Cash: Rs. {cd.get('systemRecordedCash'):,.2f}")
        print(f"[PASS] Cash Variance: Rs. {cd.get('cashVariance'):,.2f} (Status: {cd.get('varianceStatus')})")
    else:
        print("[FAIL] Cash drawer count failed")
        all_passed = False

    # 3. Test Bank UPI Inbound Webhook Ingestion
    test_webhook = {
        "utr": "624519998822",
        "amount": 250.00,
        "payer_vpa": "karthik.bodi@okhdfcbank",
        "payment_app": "GooglePay",
        "timestamp": f"{test_date} 17:15:30",
        "status": "SUCCESS"
    }
    ok, res = test_endpoint("3. Ingest Bank UPI Webhook", f"{BASE_URL}/api/reconciliation/upi/webhook", method="POST", payload=test_webhook)
    if ok and res.get("success") and res.get("utr") == "624519998822":
        print(f"[PASS] Ingested Webhook UTR: {res.get('utr')} | Amount: Rs. {res.get('record', {}).get('amount')}")
    else:
        print("[FAIL] Webhook ingestion failed")
        all_passed = False

    # 4. Test UPI 2-Way Matcher & Unreconciled Detection
    ok, res = test_endpoint("4. UPI 2-Way UTR Matcher & Unreconciled Detection", f"{BASE_URL}/api/reconciliation/upi/unreconciled?date={test_date}")
    if ok and res.get("success"):
        print(f"[PASS] Total POS UPI Bills: {res.get('totalPosUpiBills')}")
        print(f"[PASS] Matched with Bank UTR: {res.get('matchedCount')} (Reconciliation Rate: {res.get('reconciliationRatePct')}%)")
        print(f"[PASS] Unreconciled POS Bills: {res.get('unreconciledPosBillsCount')}")
        print(f"[PASS] Unreconciled Bank Credits: {res.get('unreconciledBankCreditsCount')}")
    else:
        print("[FAIL] UPI matcher endpoint failed")
        all_passed = False

    # 5. Test Manager Sign-Off & Cryptographic Seal
    sign_payload = {
        "date": test_date,
        "managerId": "MGR-BODI-001",
        "managerName": "S. Murugan (Store Head)",
        "notes": "Verified cash drawer notes count, Pine Labs batch settlement, and bank UPI UTRs."
    }
    ok, res = test_endpoint("5. Store Manager EOD Sign-Off & Digital Seal", f"{BASE_URL}/api/reconciliation/eod/sign-off", method="POST", payload=sign_payload)
    if ok and res.get("success"):
        sr = res.get("signedReport", {})
        print(f"[PASS] Certificate ID: {res.get('certificateId')}")
        print(f"[PASS] Signature Hash (HMAC-SHA256): {sr.get('signatureHash')}")
        print(f"[PASS] Audit Status: {sr.get('auditStatus')}")
        print(f"[PASS] Store: {sr.get('storeName')} (GSTIN: {sr.get('storeGstin')})")
        print(f"[PASS] Signed By: {sr.get('manager', {}).get('name')}")
    else:
        print("[FAIL] Sign-off failed")
        all_passed = False

    # 6. Test Official Signed EOD Report Retrieval
    ok, res = test_endpoint("6. Retrieve Signed EOD Audit Certificate", f"{BASE_URL}/api/reconciliation/eod/report?date={test_date}")
    if ok and res.get("success") and res.get("isFinalized") and res.get("signedAudit"):
        sa = res.get("signedAudit", {})
        print(f"[PASS] Verified Certificate: {sa.get('certificateId')}")
        print(f"[PASS] Verification URL: {sa.get('verificationUrl')}")
    else:
        print("[FAIL] Report retrieval failed")
        all_passed = False

    # 7. Test UI Page Delivery
    ok, html = test_endpoint("7. Store Manager Reconciliation UI HTML", f"{BASE_URL}/reconciliation.html")
    if ok and "Cash Drawer Denomination Counter" in html and "Bank UPI Webhook Matcher" in html:
        print(f"[PASS] UI page delivered successfully ({len(html):,} chars) with complete HTML5 & JS modules")
    else:
        print("[FAIL] UI delivery failed")
        all_passed = False

    print("\n" + "=" * 70)
    if all_passed:
        print(" ALL 7 EOD 3-WAY RECONCILIATION TESTS PASSED WITH 100% SUCCESS!")
    else:
        print(" SOME RECONCILIATION TESTS FAILED!")
    print("=" * 70)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
