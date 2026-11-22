import urllib.request, json

def test_get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

def test_post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

# 1. Calendar
status, cal = test_get('http://localhost:5500/api/festivals/calendar?year=2026')
print('Calendar 2026:', status, 'Festivals count:', len(cal.get('festivals', [])))
print('Annual Procurement: Rs.', cal.get('annual_summary', {}).get('total_mandi_wholesale_procurement'))
print('Annual Lock-in Savings: Rs.', cal.get('annual_summary', {}).get('total_mandi_lock_in_savings'))

# 2. Upcoming
status, upc = test_get('http://localhost:5500/api/festivals/upcoming')
print('Upcoming:', status, 'Next:', upc.get('next_festival', {}).get('name'), 'Date:', upc.get('next_festival', {}).get('festival_date'))

# 3. POs
status, pos = test_get('http://localhost:5500/api/festivals/purchase-orders?year=2026')
print('POs count:', len(pos.get('purchase_orders', [])))
for po in pos.get('purchase_orders', []):
    print(f"  {po['po_number']}: Mandi Rs.{po['total_mandi_po_amount']:,.2f} | Savings Rs.{po['mandi_lock_in_savings']:,.2f} ({po['arbitrage_savings_percent']}%)")

# 4. Generate PO for 2027
status, gen_po = test_post('http://localhost:5500/api/festivals/generate-po', {'festivalId': 'pongal_harvest', 'year': 2027})
print('Generate PO 2027:', status, 'PO Number:', gen_po.get('purchase_order', {}).get('po_number'))

# 5. Stage campaign
status, stg = test_post('http://localhost:5500/api/festivals/stage-campaigns', {'festivalId': 'deepavali', 'year': 2026})
print('Stage Campaign:', status, 'ID:', stg.get('staged_campaign', {}).get('campaign_id'))
print('  SMS len:', len(stg.get('staged_campaign', {}).get('campaign_copy', {}).get('sms_tamil', '')))
