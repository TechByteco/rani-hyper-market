import urllib.request, json

print('Testing POST /api/sync/delta...')
payload = {
    'counterId': 'POS-Counter-1',
    'batch': [
        {
            'offlineId': f'TEST-DELTA-{int(1000 + 500)}',
            'customer_name': 'Bodi Counter Customer',
            'phone': '9876543210',
            'total_amount': 285.0,
            'payment_method': 'Google Pay (UPI)',
            'items': [
                {'id': 1, 'title': 'Fresh Milk & Provisions', 'quantity': 2, 'price': 142.5}
            ]
        }
    ]
}

data_bytes = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(
    'http://localhost:5500/api/sync/delta',
    data=data_bytes,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as res:
        res_data = json.loads(res.read().decode())
        print('POST /api/sync/delta status:', res.status)
        print('Result:', res_data)
except Exception as e:
    print('POST error:', e)
