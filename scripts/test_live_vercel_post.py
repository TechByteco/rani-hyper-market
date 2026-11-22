import urllib.request, json

payload = {
    'counterId': 'POS-Counter-1',
    'batch': [
        {
            'offlineId': 'PING-TEST-LIVE-1',
            'customer_name': 'Edge Delta Ping Verification',
            'total_amount': 100.0,
            'items': []
        }
    ]
}

data_bytes = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(
    'https://rani-hyper-market.vercel.app/api/sync/delta',
    data=data_bytes,
    headers={'Content-Type': 'application/json', 'User-Agent': 'Vercel-Delta-Verifier/3.0'}
)

try:
    with urllib.request.urlopen(req) as res:
        res_data = json.loads(res.read().decode())
        print('POST /api/sync/delta Live HTTP', res.status)
        print('Result:', res_data)
except Exception as e:
    print('POST error:', e)
