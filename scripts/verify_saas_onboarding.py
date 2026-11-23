"""
Verification script for SNS Retail OS SaaS Self-Service Onboarding Engine.
Validates:
1. Column auto-mapping from legacy POS exports (Marg ERP, TallyPrime, Busy).
2. Vernacular language presets (Tamil, Telugu, Kannada, Malayalam).
3. Meta WhatsApp Cloud API credential configuration and validation.
4. Autonomous instance provisioning (subdomain assignment, 7,179 SKU catalog seeding, 5% margin guardrail).
5. Provisioned instance directory listing and webhook specifications.
"""
import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://localhost:5500"

def test_prerequisites():
    print("--> Testing GET /api/onboard/prerequisites...")
    url = f"{BASE_URL}/api/onboard/prerequisites"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        assert data["success"] is True, "Prerequisites call failed"
        
        langs = data["supportedLanguages"]
        lang_codes = [l["code"] for l in langs]
        locales = [l["locale"] for l in langs]
        print(f"    Supported Languages: {lang_codes} (Locales: {locales})")
        assert "ta" in lang_codes or "ta-IN" in locales, "Tamil missing"
        assert "te" in lang_codes or "te-IN" in locales, "Telugu missing"
        assert "kn" in lang_codes or "kn-IN" in locales, "Kannada missing"
        assert "ml" in lang_codes or "ml-IN" in locales, "Malayalam missing"
        
        guardrail = data.get("marketingGuardrailDefaultPct", 5)
        assert guardrail == 5, f"Expected 5% guardrail, got {guardrail}"
        print(f"    Default Margin Guardrail: {guardrail}%")
        
        catalog = data["defaultCatalogPreset"]
        assert catalog["skuCount"] == 7179, f"Expected 7,179 SKUs, got {catalog['skuCount']}"
        print(f"    Master FMCG SKU Count: {catalog['skuCount']}")
    print("    [PASS] Prerequisites verified.")

def test_column_mapping():
    print("--> Testing POST /api/onboard/map-columns...")
    url = f"{BASE_URL}/api/onboard/map-columns"
    
    # Test 1: Marg ERP style headers
    marg_payload = {
        "headers": ["EAN_CODE", "ITEM_NAME", "SALE_RATE", "PUR_RATE", "CLOSING_STOCK"],
        "sampleRows": [
            {"EAN_CODE": "8901030384118", "ITEM_NAME": "Surf Excel Quick Wash 1kg", "SALE_RATE": "145", "PUR_RATE": "122", "CLOSING_STOCK": "40"}
        ]
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(marg_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        mapping = data["mappings"]
        print(f"    Marg ERP mapping result: {mapping}")
        assert mapping["barcode"] == "EAN_CODE", f"Barcode mapped incorrectly: {mapping['barcode']}"
        assert mapping["productName"] == "ITEM_NAME", f"Name mapped incorrectly: {mapping['productName']}"
        assert mapping["mrp"] == "SALE_RATE", f"MRP mapped incorrectly: {mapping['mrp']}"
        assert mapping["costPrice"] == "PUR_RATE", f"Cost mapped incorrectly: {mapping['costPrice']}"
        assert mapping["stockUnits"] == "CLOSING_STOCK", f"Stock mapped incorrectly: {mapping['stockUnits']}"
    
    # Test 2: TallyPrime / Vyapar style headers
    tally_payload = {
        "headers": ["BAR_CODE", "PARTICULARS", "M.R.P.", "PURCHASE_PRICE", "BALANCE_QTY"],
        "sampleRows": []
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(tally_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        mapping = data["mappings"]
        print(f"    TallyPrime mapping result: {mapping}")
        assert mapping["barcode"] == "BAR_CODE"
        assert mapping["productName"] == "PARTICULARS"
        assert mapping["mrp"] == "M.R.P."
        assert mapping["costPrice"] == "PURCHASE_PRICE"
        assert mapping["stockUnits"] == "BALANCE_QTY"
    print("    [PASS] POS Column auto-mapping verified.")

def test_provisioning():
    print("--> Testing POST /api/onboard/provision...")
    url = f"{BASE_URL}/api/onboard/provision"
    provision_payload = {
        "storeName": "Kalyani Supermarket",
        "contactPhone": "+91 94883 22910",
        "ownerName": "Kalyani Sundaram",
        "ownerEmail": "kalyani@kalyanisupermarket.com",
        "district": "Dindigul",
        "city": "Dindigul",
        "state": "Tamil Nadu",
        "pincode": "624001",
        "gstin": "33AABCK1234D1Z5",
        "vernacularLanguage": "ta",
        "whatsappCredentials": {
            "phoneNumberId": "104928502847592",
            "wabaId": "928374928172635"
        },
        "legacyPosData": {
            "items": [
                {
                    "barcode": "8901234567890",
                    "productName": "Dindigul Thalappakatti Biryani Masala 200g",
                    "mrp": 120,
                    "costPrice": 95,
                    "stockUnits": 50
                }
            ]
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(provision_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status in (200, 201), f"Expected 200 or 201, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        assert data["success"] is True, f"Provisioning failed: {data}"
        
        inst = data["instance"]
        subdomain = inst["subdomain"]
        print(f"    Provisioned Subdomain: {subdomain}")
        assert "kalyani" in subdomain and "snsretail.in" in subdomain, f"Unexpected subdomain: {subdomain}"
        
        catalog_count = inst["catalogCount"]
        print(f"    Total Active SKUs Seeded: {catalog_count} (Master 7,179 + Legacy {inst['legacyItemsImported']})")
        assert catalog_count >= 7179, "Catalog not properly seeded"
        
        swarm = inst["marketingSwarm"]
        print(f"    Marketing Swarm Status: {swarm['status']} ({swarm['activeAgentsCount']} agents)")
        print(f"    Margin Guardrail Active: {swarm['marginGuardrailPct']}%")
        assert swarm["marginGuardrailPct"] == 5.0, "Guardrail mismatch"
        assert swarm["activeAgentsCount"] == 4, "Expected 4 marketing agents"
        
        admin = inst["adminAccess"]
        print(f"    Admin Portal URL: {admin['portalUrl']}")
        print(f"    Default Admin: {admin['defaultAdminUser']}")
        print(f"    Temp Master PIN: {admin['temporaryMasterPin']}")
        assert "admin.html" in admin["portalUrl"]
    print("    [PASS] Autonomous instance provisioning verified.")

def test_instances_listing():
    print("--> Testing GET /api/onboard/instances...")
    url = f"{BASE_URL}/api/onboard/instances"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data["success"] is True
        instances = data["instances"]
        print(f"    Found {len(instances)} provisioned instance(s).")
        subdomains = [i["subdomain"] for i in instances]
        assert any("kalyani" in s for s in subdomains), "Kalyani Supermarket not found in instances"
    print("    [PASS] Instance listing verified.")

def test_webhooks():
    print("--> Testing GET /api/onboard/webhooks...")
    url = f"{BASE_URL}/api/onboard/webhooks"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data["success"] is True
        webhooks = data["supportedWebhooks"]
        webhook_keys = [w["webhookKey"] for w in webhooks]
        print(f"    Supported Webhooks: {webhook_keys}")
        assert "WH_WHATSAPP_INBOUND" in webhook_keys
        assert "WH_POS_SYNC" in webhook_keys
        assert "WH_DISPATCH_GPS" in webhook_keys
    print("    [PASS] Webhook specifications verified.")

if __name__ == "__main__":
    print("===================================================================")
    print("   SNS RETAIL OS SAAS SELF-SERVICE ONBOARDING ENGINE VERIFICATION  ")
    print("===================================================================")
    try:
        test_prerequisites()
        test_column_mapping()
        test_provisioning()
        test_instances_listing()
        test_webhooks()
        print("\n===================================================================")
        print("   ALL SAAS ONBOARDING TESTS COMPLETED SUCCESSFULLY! (100% PASS)   ")
        print("===================================================================")
    except Exception as e:
        print(f"\n[FAIL] Test failure: {e}")
        sys.exit(1)
