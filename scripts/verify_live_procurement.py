"""
Live Production Verification Suite for Wholesale Mandi Procurement & EOQ Optimizer
Rani Hyper Market (SNS Market) — Main Road, Bodinayakanur & Theni District, Tamil Nadu
Target Host: https://rani-hyper-market.vercel.app
"""

import sys
import json
import urllib.request
import urllib.parse

LIVE_BASE_URL = 'https://rani-hyper-market.vercel.app'

def test_live_mandi_board():
    print("\n--- Testing Live Production: 1. Mandi Rates & 30-Day Moving Average Board ---")
    url = f"{LIVE_BASE_URL}/api/procurement/mandis?date=2026-04-02"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | As Of Date: {data.get('asOfDate')}")
        assert data.get('totalStaplesTracked') == 10
        assert data.get('dipOpportunitiesCount') >= 5
        print(f"[PASS] Staples Tracked: {data['totalStaplesTracked']} | Active Mandi Dips: {data['dipOpportunitiesCount']}")

        required_staples = ['RICE-PONNI-25KG', 'DAL-TOOR-50KG', 'OIL-SUN-15L', 'SUGAR-M30-50KG', 'CHILLI-RED-20KG']
        for code in required_staples:
            item = next((b for b in data['board'] if b['stapleCode'] == code), None)
            assert item is not None
            assert item['isDipOpportunity'] == True
            assert item['marginExpansionPct'] >= 3.5
            print(f"[PASS] {item['name']}: Spot ₹{item['currentSpotMandiRate']} < 30D MA ₹{item['movingAverage30d']} | Dip: {item['dipPct']}% | Margin Gain: +{item['marginExpansionPct']}%")

def test_live_eoq_engine():
    print("\n--- Testing Live Production: 2. EOQ Math Formulation ---")
    url = f"{LIVE_BASE_URL}/api/procurement/eoq?code=RICE-PONNI-25KG"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        eoq = data['eoq']
        print(f"[STATUS] HTTP 200 | Staple: {eoq['name']}")
        print(f"[PASS] Annual Demand: {eoq['annualDemandUnits']} | Order Cost: ₹{eoq['orderingCostPerPO']} | Holding Cost: ₹{eoq['holdingCostPerUnitYear']}/yr")
        assert eoq['roundedEOQUnits'] == 117
        print(f"[PASS] Exact EOQ: {eoq['exactEOQ']} units -> Rounded: {eoq['roundedEOQUnits']} bags ({eoq['cycleDays']} days/cycle)")

def test_live_auto_draft_pos():
    print("\n--- Testing Live Production: 3. Auto-Draft Vendor POs on Mandi Dips ---")
    url = f"{LIVE_BASE_URL}/api/procurement/po/auto-draft"
    payload = json.dumps({'date': '2026-04-02'}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | Count Drafted: {data['countDrafted']}")
        assert data['countDrafted'] >= 5
        first_po = data['purchaseOrders'][0]
        print(f"[PASS] Live Generated PO: {first_po['poNumber']} for {first_po['stapleName']}")
        print(f"[PASS] Landed Total: ₹{first_po['totalLandedAmount']:,.2f} | Net Savings: ₹{first_po['estimatedTotalSavings']:,.2f}")
        return first_po['poNumber']

def test_live_po_approval_and_seal(po_number):
    print("\n--- Testing Live Production: 4. Manager Digital Signature & Official Store Seal ---")
    url = f"{LIVE_BASE_URL}/api/procurement/po/approve"
    payload = json.dumps({
        'poNumber': po_number,
        'approverName': 'S. Murugan (Store Head)'
    }).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | Approved PO: {data['poNumber']}")
        assert data['status'] == 'APPROVED_AND_ISSUED'
        assert data['digitalSignature'] is not None and len(data['digitalSignature']) == 64
        print(f"[PASS] Digital Signature (HMAC-SHA256): {data['digitalSignature']}")

def test_live_po_view_document(po_number):
    print("\n--- Testing Live Production: 5. Printable HTML/PDF View with Store Seal ---")
    url = f"{LIVE_BASE_URL}/api/procurement/po/view?poNumber={po_number}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        assert 'RANI HYPER MARKET' in html
        assert 'BODINAYAKANUR' in html
        assert '33BAGPN1341C1ZC' in html
        assert '<svg' in html and 'OFFICIAL STORE SEAL' in html.upper()
        print(f"[STATUS] HTTP 200 (text/html)")
        print(f"[PASS] Delivered Complete Printable Document ({len(html):,} chars) with official store seal")

def test_live_whatsapp_share_link(po_number):
    print("\n--- Testing Live Production: 6. WhatsApp Shareable Message ---")
    url = f"{LIVE_BASE_URL}/api/procurement/po/whatsapp?poNumber={po_number}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[STATUS] HTTP 200 | Vendor WhatsApp: {data['vendorPhone']}")
        assert 'api.whatsapp.com/send' in data['deepLink']
        assert po_number in data['messageText']
        print(f"[PASS] WhatsApp Link: {data['deepLink'][:90]}...")

def test_live_procurement_ui():
    print("\n--- Testing Live Production: 7. Store Manager Procurement UI HTML ---")
    url = f"{LIVE_BASE_URL}/procurement"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        html = resp.read().decode('utf-8')
        assert 'Economic Order Quantity' in html
        assert 'Madurai' in html and 'Theni' in html and 'Dindigul' in html
        print(f"[STATUS] HTTP 200 | Size: {len(html):,} characters")
        print(f"[PASS] Live UI page delivered successfully!")

def main():
    print("=" * 70)
    print(" RANI HYPER MARKET — LIVE VERCEL PRODUCTION PROCUREMENT SUITE")
    print("=" * 70)

    try:
        test_live_mandi_board()
        test_live_eoq_engine()
        po_number = test_live_auto_draft_pos()
        test_live_po_approval_and_seal(po_number)
        test_live_po_view_document(po_number)
        test_live_whatsapp_share_link(po_number)
        test_live_procurement_ui()

        print("\n" + "=" * 70)
        print(" ALL 7 LIVE VERCEL PRODUCTION PROCUREMENT TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 70)
    except Exception as e:
        print(f"\n[FAIL] Live production test encountered an error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
