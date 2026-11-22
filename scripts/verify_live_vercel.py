import urllib.request, json, time, sys

print('Waiting 15 seconds for Vercel to build commit fd5cd76...')
time.sleep(15)

url = 'https://rani-hyper-market.vercel.app/api/sync/delta'

for attempt in range(1, 8):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Vercel-Delta-Verifier/2.0'})
        with urllib.request.urlopen(req, timeout=8) as res:
            data = json.loads(res.read().decode())
            print(f'[Attempt {attempt}] HTTP {res.status}:')
            print('  Pipeline:', data.get('pipeline'))
            print('  Uptime:', data.get('cloudUptime'))
            print('  Zero Pauses:', data.get('zeroPauses'))
            print('  Total Orders in Ledger:', data.get('totalOrdersInLedger'))
            print('  5-Year Stats:', data.get('fiveYearReconciledStats'))
            print('  Festival Intelligence:', data.get('festivalIntelligence'))
            if data.get('pipeline') == 'Direct Vercel Delta Pipeline':
                print('\n🎉 VERCEL PRODUCTION DELTA PIPELINE IS VERIFIED LIVE AND ACTIVE!')
                sys.exit(0)
    except Exception as e:
        print(f'[Attempt {attempt}] HTTP check pending: {e}')
        time.sleep(8)

print('Timeout waiting for deployment.')
