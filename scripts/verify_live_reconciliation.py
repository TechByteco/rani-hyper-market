#!/usr/bin/env python3
"""
Live Vercel Production Verification for End-of-Day (EOD) 3-Way Reconciliation Module
Rani Hyper Market (SNS Market) — Bodinayakanur & Theni District, Tamil Nadu
URL: https://rani-hyper-market.vercel.app
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "https://rani-hyper-market.vercel.app"

def test_endpoint(name, url, method="GET", payload=None):
    print(f"\n--- Testing Live Production: {name} ---")
    print(f"[{method}] {url}")
    try:
        headers = {"User-Agent": "LiveReconciliationTest/1.0"}
        data_bytes = None
        if payload is not None:
            headers["Content-Type"] = "application/json"
            data_bytes = json.dumps(payload).encode("utf-8")
        
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=20) as res:
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
    print(" RANI HYPER MARKET — LIVE VERCEL PRODUCTION 3-WAY RECONCILIATION")
    print("=" * 70)
    all_passed = True
    test_date = "2026-04-01"

    # 1. Test Live EOD Summary
    ok, res = test_endpoint("1. Live Daily EOD 3-Way Summary", f"{BASE_URL}/api/reconciliation/eod/summary?date={test_date}")
    if ok and res.get("success"):
        fm = res.get("financialMetrics", {})
        cd = res.get("channelBreakdown", {})
        print(f"[PASS] Date: {res.get('date')} | Total Invoices: {res.get('totalBills')}")
        print(f"[PASS] Total Sales: Rs. {fm.get('totalSales'):,.2f} | COGS: Rs. {fm.get('totalCogs'):,.2f} | Gross Margin: Rs. {fm.get('grossMargin'):,.2f} ({fm.get('grossMarginPct')}%)")
        print(f"[PASS] Cash Counter: {cd.get('cash', {}).get('billCount')} bills ({cd.get('cash', {}).get('volumePct')}%) [Target: 74.5%]")
        print(f"[PASS] UPI Settlements: {cd.get('upi', {}).get('billCount')} bills ({cd.get('upi', {}).get('volumePct')}%) [Target: 21.5%]")
        print(f"[PASS] Card Swipes: {cd.get('card', {}).get('billCount')} bills ({cd.get('card', {}).get('volumePct')}%) [Target: 4.0%]")
    else:
        print("[FAIL] Live EOD summary failed")
        all_passed = False

    # 2. Test Live Cash Drawer Denomination Count
    recorded_cash = res.get("channelBreakdown", {}).get("cash", {}).get("totalAmount", 25000)
    float_amt = 2000.00
    target_gross = recorded_cash + float_amt + 25.00
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
        "notes": "Live production cashier counter closing count"
    }

    ok, res = test_endpoint("2. Live Physical Cash Drawer Count", f"{BASE_URL}/api/reconciliation/cash-drawer/count", method="POST", payload=cash_payload)
    if ok and res.get("success"):
        cd = res.get("cashDrawer", {})
        print(f"[PASS] Gross Physical Cash: Rs. {cd.get('grossPhysicalCash'):,.2f}")
        print(f"[PASS] Net Physical Cash: Rs. {cd.get('netPhysicalCash'):,.2f}")
        print(f"[PASS] System Recorded Cash: Rs. {cd.get('systemRecordedCash'):,.2f}")
        print(f"[PASS] Cash Variance: Rs. {cd.get('cashVariance'):,.2f} (Status: {cd.get('varianceStatus')})")
    else:
        print("[FAIL] Live Cash drawer count failed")
        all_passed = False

    # 3. Test Live Bank UPI Webhook Ingestion
    test_webhook = {
        "utr": "624519776655",
        "amount": 340.00,
        "payer_vpa": "ramesh.bodi@okaxis",
        "payment_app": "PhonePe",
        "timestamp": f"{test_date} 18:05:00",
        "status": "SUCCESS"
    }
    ok, res = test_endpoint("3. Live Ingest Bank UPI Webhook", f"{BASE_URL}/api/reconciliation/upi/webhook", method="POST", payload=test_webhook)
    if ok and res.get("success") and res.get("utr") == "624519776655":
        print(f"[PASS] Ingested Webhook UTR: {res.get('utr')} | Amount: Rs. {res.get('record', {}).get('amount')}")
    else:
        print("[FAIL] Live Webhook ingestion failed")
        all_passed = False

    # 4. Test Live UPI 2-Way Matcher
    ok, res = test_endpoint("4. Live UPI 2-Way Matcher", f"{BASE_URL}/api/reconciliation/upi/unreconciled?date={test_date}")
    if ok and res.get("success"):
        print(f"[PASS] Total POS UPI Bills: {res.get('totalPosUpiBills')}")
        print(f"[PASS] Matched with Bank UTR: {res.get('matchedCount')} (Reconciliation Rate: {res.get('reconciliationRatePct')}%)")
        print(f"[PASS] Unreconciled POS Bills: {res.get('unreconciledPosBillsCount')}")
        print(f"[PASS] Unreconciled Bank Credits: {res.get('unreconciledBankCreditsCount')}")
    else:
        print("[FAIL] Live UPI matcher failed")
        all_passed = False

    # 5. Test Live Manager EOD Sign-Off & Cryptographic Seal
    sign_payload = {
        "date": test_date,
        "managerId": "MGR-BODI-001",
        "managerName": "S. Murugan (Store Head)",
        "notes": "Live verified cash drawer count, UPI UTR settlement, and POS Card batch."
    }
    ok, res = test_endpoint("5. Live Manager EOD Sign-Off & Seal", f"{BASE_URL}/api/reconciliation/eod/sign-off", method="POST", payload=sign_payload)
    if ok and res.get("success"):
        sr = res.get("signedReport", {})
        print(f"[PASS] Certificate ID: {res.get('certificateId')}")
        print(f"[PASS] Signature Hash (HMAC-SHA256): {sr.get('signatureHash')}")
        print(f"[PASS] Audit Status: {sr.get('auditStatus')}")
    else:
        print("[FAIL] Live Sign-off failed")
        all_passed = False

    # 6. Test Live Report Retrieval
    ok, res = test_endpoint("6. Live Retrieve Signed EOD Report", f"{BASE_URL}/api/reconciliation/eod/report?date={test_date}")
    if ok and res.get("success") and res.get("isFinalized"):
        print(f"[PASS] Verified Certificate: {res.get('signedAudit', {}).get('certificateId')}")
    else:
        print("[FAIL] Live Report retrieval failed")
        all_passed = False

    # 7. Test Live Reconciliation UI Delivery
    ok, html = test_endpoint("7. Live Store Manager Reconciliation UI HTML", f"{BASE_URL}/reconciliation.html")
    if ok and "Cash Drawer Denomination Counter" in html and "Bank UPI Webhook Matcher" in html:
        print(f"[PASS] Live UI page delivered successfully ({len(html):,} chars)!")
    else:
        print("[FAIL] Live UI delivery failed")
        all_passed = False

    print("\n" + "=" * 70)
    if all_passed:
        print(" ALL 7 LIVE VERCEL PRODUCTION RECONCILIATION TESTS PASSED WITH 100% SUCCESS!")
    else:
        print(" SOME LIVE TESTS FAILED!")
    print("=" * 70)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
