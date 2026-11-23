"""
RBAC & IAM Security System Live Vercel Production Verification Suite
Rani Hyper Market (SNS Market) — Main Road, Bodinayakanur & Theni District, Tamil Nadu

Target Production URL: https://rani-hyper-market.vercel.app
"""

import sys
import json
import time
import urllib.request
import urllib.error

LIVE_URL = "https://rani-hyper-market.vercel.app"

def log_test(name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name} {detail}")
    if not passed:
        raise AssertionError(f"Test failed: {name} - {detail}")

def post_json(endpoint, data=None, headers=None):
    url = f"{LIVE_URL}{endpoint}"
    payload = json.dumps(data or {}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header('Content-Type', 'application/json')
    req.add_header('Content-Length', str(len(payload)))
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            return res.getcode(), json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, {"raw": body}
    except Exception as e:
        return 0, {"error": str(e)}

def get_json(endpoint, headers=None):
    url = f"{LIVE_URL}{endpoint}"
    req = urllib.request.Request(url, method="GET")
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            return res.getcode(), json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, {"raw": body}
    except Exception as e:
        return 0, {"error": str(e)}

def main():
    print("=" * 70)
    print("🌐 LIVE VERCEL PRODUCTION: RBAC & IAM SECURITY VERIFICATION")
    print(f"Target URL: {LIVE_URL}")
    print("=" * 70)

    # 1. Multi-Role Authentication on Live Serverless
    print("\n[Phase 1] Testing Live Multi-Role Auth & JWT Tokens...")
    code, csh = post_json("/api/auth/login", {"username": "cashier1", "pin": "1122"})
    log_test("Live Cashier Auth", code == 200 and csh.get("success"), f"(Token received, User: {csh.get('user', {}).get('name')})")
    cashier_token = csh.get("token")

    code, v = get_json("/api/auth/me", headers={"Authorization": f"Bearer {cashier_token}"})
    log_test("Live JWT Verification", code == 200 and v.get("valid"))

    code, dir_res = post_json("/api/auth/login", {"username": "director", "pin": "9999"})
    log_test("Live Director Super Admin Auth", code == 200 and dir_res.get("success"))
    director_token = dir_res.get("token")

    # 2. Strict Boundary Enforcement on Live Serverless
    print("\n[Phase 2] Testing Live Route Access Restrictions...")
    code, exp_csh = get_json("/api/customers/export", headers={"Authorization": f"Bearer {cashier_token}"})
    log_test("Live Cashier Blocked from Exporting Customer Phones (403)", code == 403)

    code, exp_dir = get_json("/api/customers/export", headers={"Authorization": f"Bearer {director_token}"})
    log_test("Live Director Full Customer Export (200)", code == 200 and exp_dir.get("success"), f"(Records: {exp_dir.get('totalCustomers')})")

    # 3. 5% Margin Guardrail on Live Serverless
    print("\n[Phase 3] Testing Live 5.0% Margin Guardrail...")
    code, g_safe = post_json("/api/campaigns/validate-discount", {
        "sellingPrice": 100,
        "costPrice": 90,
        "discountPct": 4
    })
    log_test("Live Safe 4% Discount Allowed", code == 200 and g_safe.get("valid") is True, f"(Margin: {g_safe.get('grossMarginPct')}%)")

    code, g_breach = post_json("/api/campaigns/validate-discount", {
        "sellingPrice": 100,
        "costPrice": 90,
        "discountPct": 10
    })
    log_test("Live Margin Breach Blocked (422)", code == 422 and g_breach.get("valid") is False, f"(Max Disc: {g_breach.get('maxAllowableDiscountPct')}%)")

    # 4. WebAuthn Biometric Passkey Handover on Live Serverless
    print("\n[Phase 4] Testing Live WebAuthn Passkey Handover...")
    code, chal = post_json("/api/auth/passkey/challenge", {"username": "cashier2"})
    log_test("Live Passkey Challenge", code == 200 and "challenge" in chal.get("challenge", {}))

    t0 = time.time()
    code, hnd = post_json("/api/auth/handover", {
        "fromUser": "Kavitha R.",
        "incomingUser": "cashier2",
        "drawerFloatInr": 2500,
        "credential": {
            "id": "cred-live-touchid-csh2",
            "signature": "live-fido2-signature",
            "passkeyId": "fido2-biometric-verified"
        }
    })
    elapsed_ms = round((time.time() - t0) * 1000)
    log_test("Live Passkey Shift Handover", code == 200 and hnd.get("success"), f"(Transition: {elapsed_ms}ms, New Cashier: {hnd.get('user', {}).get('name')})")

    print("\n" + "=" * 70)
    print("🎉 ALL LIVE VERCEL PRODUCTION RBAC TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    main()
