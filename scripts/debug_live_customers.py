import urllib.request, json

for ep in ['/api/analytics/customers', '/api/analytics/top-customers']:
    url = f'https://rani-hyper-market.vercel.app{ep}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as res:
            status = res.getcode()
            body = res.read().decode('utf-8')
            print(f"\n=== Endpoint: {ep} (HTTP {status}) ===")
            print(body[:300])
    except Exception as e:
        print(f"\n=== Endpoint: {ep} ERROR ===")
        print(str(e))
