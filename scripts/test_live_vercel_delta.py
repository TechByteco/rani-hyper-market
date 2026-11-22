import urllib.request, json, time

print('Waiting 15 seconds for Vercel auto-deploy to build commit 1a5c416...')
time.sleep(15)

url = 'https://rani-hyper-market.vercel.app/api/sync/delta'
print(f'Querying {url}...')

for attempt in range(1, 6):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Vercel-Delta-Verifier/1.0'})
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode())
            print(f'[Attempt {attempt}] HTTP {res.status}:')
            print('  Pipeline:', data.get('pipeline'))
            print('  Cloud Uptime:', data.get('cloudUptime'))
            print('  Zero Pauses:', data.get('zeroPauses'))
            print('  Total Orders:', data.get('totalOrdersInLedger'))
            print('  5-Year Stats:', data.get('fiveYearReconciledStats'))
            print('  Festival:', data.get('festivalIntelligence'))
            if data.get('pipeline') == 'Direct Vercel Delta Pipeline':
                print('\n🎉 VERCEL PRODUCTION DELTA PIPELINE IS 100% LIVE!')
                break
    except Exception as e:
        print(f'[Attempt {attempt}] Waiting... ({e})')
        time.sleep(10)
