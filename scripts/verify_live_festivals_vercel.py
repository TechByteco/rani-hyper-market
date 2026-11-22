import urllib.request, json

def test_url(url, method='GET', data=None):
    headers = {'User-Agent': 'Mozilla/5.0'}
    if data:
        headers['Content-Type'] = 'application/json'
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method=method)
    else:
        req = urllib.request.Request(url, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode('utf-8')
            return resp.status, content
    except Exception as e:
        return 0, str(e)

print('--- 1. Static Calendar 2026-2035 JSON ---')
s, c = test_url('https://rani-hyper-market.vercel.app/festival_surge_calendar_2026_2035.json')
print('Status:', s, 'Size:', len(c))
if s == 200:
    j = json.loads(c)
    print('Years present:', sorted(list(j.keys())))

print('\n--- 2. Static POs JSON ---')
s, c = test_url('https://rani-hyper-market.vercel.app/automated_vendor_purchase_orders.json')
print('Status:', s, 'Size:', len(c))

print('\n--- 3. Static Staged Campaigns JSON ---')
s, c = test_url('https://rani-hyper-market.vercel.app/staged_festival_campaigns.json')
print('Status:', s, 'Size:', len(c))

print('\n--- 4. API /api/festivals/calendar?year=2026 ---')
s, c = test_url('https://rani-hyper-market.vercel.app/api/festivals/calendar?year=2026')
print('Status:', s)
if s == 200:
    res = json.loads(c)
    print('Year:', res.get('year'))
    print('Annual Procurement: Rs.', res.get('annual_summary', {}).get('total_mandi_wholesale_procurement'))
    print('Annual Lock-in Savings: Rs.', res.get('annual_summary', {}).get('total_mandi_lock_in_savings'))
    print('Festivals:', [f.get('name') for f in res.get('festivals', [])])

print('\n--- 5. API /api/festivals/upcoming ---')
s, c = test_url('https://rani-hyper-market.vercel.app/api/festivals/upcoming')
print('Status:', s)
if s == 200:
    res = json.loads(c)
    print('Next:', res.get('next_festival', {}).get('name'), 'Date:', res.get('next_festival', {}).get('festival_date'))

print('\n--- 6. API /api/festivals/purchase-orders?year=2026 ---')
s, c = test_url('https://rani-hyper-market.vercel.app/api/festivals/purchase-orders?year=2026')
print('Status:', s)
if s == 200:
    res = json.loads(c)
    print('Count:', res.get('count'))
    for p in res.get('purchase_orders', []):
        print(f"  {p['po_number']}: Mandi Rs.{p['total_mandi_po_amount']:,.2f} | Savings Rs.{p['mandi_lock_in_savings']:,.2f}")

print('\n--- 7. POST /api/festivals/generate-po (2027) ---')
s, c = test_url('https://rani-hyper-market.vercel.app/api/festivals/generate-po', method='POST', data={'festivalId': 'pongal_harvest', 'year': 2027})
print('Status:', s)
if s == 200:
    res = json.loads(c)
    print('PO 2027:', res.get('purchase_order', {}).get('po_number'), 'Mandi Rs.', res.get('purchase_order', {}).get('total_mandi_po_amount'))

print('\n--- 8. POST /api/festivals/stage-campaigns ---')
s, c = test_url('https://rani-hyper-market.vercel.app/api/festivals/stage-campaigns', method='POST', data={'festivalId': 'deepavali', 'year': 2026})
print('Status:', s)
if s == 200:
    res = json.loads(c)
    cmp = res.get('staged_campaign', {})
    print('Staged:', cmp.get('campaign_id'), '| Bundle:', cmp.get('bundle_title'))
    print('SMS Tamil (len %d):' % len(cmp.get('campaign_copy', {}).get('sms_tamil', '')), cmp.get('campaign_copy', {}).get('sms_tamil'))
