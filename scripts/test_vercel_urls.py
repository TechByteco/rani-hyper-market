import urllib.request

for test_url in [
    'https://rani-hyper-market.vercel.app/api',
    'https://rani-hyper-market.vercel.app/api/index',
    'https://rani-hyper-market.vercel.app/api/orders',
    'https://rani-hyper-market.vercel.app/api/sync/delta'
]:
    try:
        req = urllib.request.Request(test_url, headers={'User-Agent': 'Test/1.0'})
        with urllib.request.urlopen(req, timeout=5) as res:
            print(f'{test_url} -> {res.status}')
    except urllib.error.HTTPError as e:
        print(f'{test_url} -> {e.code} ({e.reason})')
    except Exception as e:
        print(f'{test_url} -> {e}')
