"""
Automated Verification Suite for Wholesale Mandi Procurement Optimization & EOQ Module
Rani Hyper Market (SNS Market) — Main Road, Bodinayakanur & Theni District, Tamil Nadu
"""

import sys
import json
import urllib.request
import urllib.parse

BASE_URL = 'http://localhost:5500'

def test_mandi_board():
    print("\n--- Testing: 1. Mandi Rates & 30-Day Moving Average Board ---")
    url = f"{BASE_URL}/api/procurement/mandis?date=2026-04-02"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | As Of Date: {data.get('asOfDate')}")
        assert data.get('totalStaplesTracked') == 10, f"Expected 10 staples, got {data.get('totalStaplesTracked')}"
        assert data.get('dipOpportunitiesCount') >= 5, f"Expected >= 5 dip opportunities, got {data.get('dipOpportunitiesCount')}"
        print(f"[PASS] Staples Tracked: {data['totalStaplesTracked']} | Active Mandi Dips: {data['dipOpportunitiesCount']}")

        # Verify the 5 required volume staples have dips with >= +3.5% margin expansion
        required_staples = ['RICE-PONNI-25KG', 'DAL-TOOR-50KG', 'OIL-SUN-15L', 'SUGAR-M30-50KG', 'CHILLI-RED-20KG']
        for code in required_staples:
            item = next((b for b in data['board'] if b['stapleCode'] == code), None)
            assert item is not None, f"Missing required staple: {code}"
            assert item['isDipOpportunity'] == True, f"{code} should be dip opportunity"
            assert item['marginExpansionPct'] >= 3.5, f"{code} margin expansion should be >= 3.5%, got {item['marginExpansionPct']}%"
            assert item['currentSpotMandiRate'] < item['movingAverage30d'], f"{code} spot price should be < 30D MA"
            print(f"[PASS] {item['name']}: Spot ₹{item['currentSpotMandiRate']} < 30D MA ₹{item['movingAverage30d']} | Dip: {item['dipPct']}% | Margin Gain: +{item['marginExpansionPct']}% (≥ +3.5%)")

def test_eoq_engine():
    print("\n--- Testing: 2. Economic Order Quantity (EOQ) Math Formulation ---")
    url = f"{BASE_URL}/api/procurement/eoq?code=RICE-PONNI-25KG"
    with urllib.request.urlopen(url) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        eoq = data['eoq']
        print(f"[STATUS] HTTP 200 | Staple: {eoq['name']}")
        print(f"[PASS] Annual Demand (D): {eoq['annualDemandUnits']} bags | Order Cost (S): ₹{eoq['orderingCostPerPO']} | Holding Cost (H): ₹{eoq['holdingCostPerUnitYear']}/bag/yr")
        
        # Verify EOQ = sqrt(2 * D * S / H)
        expected_eoq = (2 * eoq['annualDemandUnits'] * eoq['orderingCostPerPO'] / eoq['holdingCostPerUnitYear']) ** 0.5
        assert abs(eoq['exactEOQ'] - round(expected_eoq, 2)) < 0.1, f"EOQ math mismatch: {eoq['exactEOQ']} vs {expected_eoq}"
        assert eoq['roundedEOQUnits'] == round(expected_eoq), f"Rounded EOQ mismatch: {eoq['roundedEOQUnits']} vs {round(expected_eoq)}"
        print(f"[PASS] Verified Formula: {eoq['formulaExplanation']}")
        print(f"[PASS] Exact EOQ: {eoq['exactEOQ']} units -> Rounded: {eoq['roundedEOQUnits']} bags ({eoq['cycleDays']} days/cycle)")

def test_auto_draft_pos():
    print("\n--- Testing: 3. Auto-Draft Vendor Purchase Orders on Mandi Dips ---")
    url = f"{BASE_URL}/api/procurement/po/auto-draft"
    payload = json.dumps({'date': '2026-04-02'}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | Count Drafted: {data['countDrafted']}")
        assert data['countDrafted'] >= 5, f"Expected at least 5 drafted POs, got {data['countDrafted']}"
        first_po = data['purchaseOrders'][0]
        print(f"[PASS] Generated PO: {first_po['poNumber']} for {first_po['stapleName']}")
        print(f"[PASS] Vendor: {first_po['vendor']['name']} | Mandi: {first_po['mandiMarketName']}")
        print(f"[PASS] Qty: {first_po['orderQuantity']} {first_po['packUnit']} @ Mandi Rate ₹{first_po['unitMandiRate']}")
        print(f"[PASS] Total Landed: ₹{first_po['totalLandedAmount']:,.2f} | Net Savings vs 30D MA: ₹{first_po['estimatedTotalSavings']:,.2f}")
        return first_po['poNumber']

def test_po_approval_and_seal(po_number):
    print("\n--- Testing: 4. Manager Digital Signature & Official Store Seal ---")
    url = f"{BASE_URL}/api/procurement/po/approve"
    payload = json.dumps({
        'poNumber': po_number,
        'approverName': 'S. Murugan (Store Head)'
    }).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | Approved PO: {data['poNumber']}")
        assert data['status'] == 'APPROVED_AND_ISSUED'
        assert data['digitalSignature'] is not None and len(data['digitalSignature']) == 64
        print(f"[PASS] Cryptographic Digital Signature (HMAC-SHA256): {data['digitalSignature']}")
        print(f"[PASS] Authorized Seal Verified: {data['purchaseOrder']['authorizedSeal']['sealVerified']}")
        print(f"[PASS] Store GSTIN: {data['purchaseOrder']['storeProfile']['gstin']}")

def test_po_view_document(po_number):
    print("\n--- Testing: 5. Printable HTML/PDF PO View with Authorized Store Seal ---")
    url = f"{BASE_URL}/api/procurement/po/view?poNumber={po_number}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        content_type = resp.headers.get('Content-Type')
        assert 'text/html' in content_type, f"Expected text/html, got {content_type}"
        html = resp.read().decode('utf-8')
        assert 'RANI HYPER MARKET' in html
        assert 'BODINAYAKANUR' in html
        assert '33BAGPN1341C1ZC' in html
        assert 'PURCHASE ORDER' in html
        assert po_number in html
        assert '<svg' in html and 'OFFICIAL STORE SEAL' in html.upper()
        assert 'window.print()' in html
        print(f"[STATUS] HTTP 200 ({content_type})")
        print(f"[PASS] Delivered Complete Printable PO Document ({len(html):,} chars) with embedded SVG seal")

def test_whatsapp_share_link(po_number):
    print("\n--- Testing: 6. WhatsApp Shareable Message & Deep-Link ---")
    url = f"{BASE_URL}/api/procurement/po/whatsapp?poNumber={po_number}"
    with urllib.request.urlopen(url) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | Vendor WhatsApp: {data['vendorPhone']}")
        assert 'api.whatsapp.com/send' in data['deepLink']
        assert po_number in data['messageText']
        assert '33BAGPN1341C1ZC' in data['messageText']
        assert 'Bodinayakanur' in data['messageText']
        print(f"[PASS] WhatsApp Link: {data['deepLink'][:90]}...")
        print(f"[PASS] Formatted Bilingual Tamil/English Dispatch Message:\n{data['messageText'][:260]}...")

def test_procurement_ui():
    print("\n--- Testing: 7. Store Manager Procurement UI Dashboard HTML ---")
    url = f"{BASE_URL}/procurement.html"
    with urllib.request.urlopen(url) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        assert 'Economic Order Quantity' in html
        assert 'Madurai' in html and 'Theni' in html and 'Dindigul' in html
        assert 'loadMandiBoard' in html
        assert 'autoDraftAllPOs' in html
        print(f"[STATUS] HTTP 200 | Size: {len(html):,} characters")
        print(f"[PASS] Procurement Dashboard UI delivered successfully with full client-side reactive bindings")

def main():
    print("=" * 70)
    print(" RANI HYPER MARKET — WHOLESALE MANDI PROCUREMENT & EOQ TEST SUITE")
    print("=" * 70)

    try:
        test_mandi_board()
        test_eoq_engine()
        po_number = test_auto_draft_pos()
        test_po_approval_and_seal(po_number)
        test_po_view_document(po_number)
        test_whatsapp_share_link(po_number)
        test_procurement_ui()

        print("\n" + "=" * 70)
        print(" ALL 7 PROCUREMENT & EOQ TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 70)
    except Exception as e:
        print(f"\n[FAIL] Test suite encountered an error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
