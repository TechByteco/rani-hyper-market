import urllib.request, json

print('=== TESTING LIVE PRODUCTION VERCEL DELTA PIPELINE ===\n')

url = 'https://rani-hyper-market.vercel.app/api/sync/delta'
req = urllib.request.Request(url, headers={'User-Agent': 'Vercel-Delta-Verifier/3.0'})
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode())
    print('GET /api/sync/delta -> HTTP', res.status)
    print('  Status:', data.get('status'))
    print('  Pipeline:', data.get('pipeline'))
    print('  Cloud Uptime:', data.get('cloudUptime'))
    print('  Zero Pauses:', data.get('zeroPauses'))
    print('  Total Orders in Ledger:', data.get('totalOrdersInLedger'))
    print('  Pending Online Orders Count:', data.get('pendingOnlineOrdersCount'))
    print('  5-Year Reconciled Stats:', data.get('fiveYearReconciledStats'))
    print('  Festival Intelligence:', data.get('festivalIntelligence'))

print('\n=== TESTING LIVE PRODUCTION ORDERS ENDPOINT ===\n')
orders_url = 'https://rani-hyper-market.vercel.app/api/orders'
req2 = urllib.request.Request(orders_url, headers={'User-Agent': 'Vercel-Delta-Verifier/3.0'})
with urllib.request.urlopen(req2) as res2:
    data2 = json.loads(res2.read().decode())
    print('GET /api/orders -> HTTP', res2.status)
    print('  Count:', data2.get('count'))
    for o in data2.get('orders', [])[:5]:
        print(f"  [{o.get('id')}] {o.get('customer_name')} | Rs {o.get('total_amount')} | {o.get('status')}")
