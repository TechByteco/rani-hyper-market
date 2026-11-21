import urllib.request, json

live_base = 'https://rani-hyper-market.vercel.app'

test_cases = [
    {
        'desc': 'Customer CRM Endpoints (/api/analytics/customers)',
        'url': f'{live_base}/api/analytics/customers',
        'validate': lambda d: isinstance(d, dict) and d.get('total') == 327 and len(d.get('customers', [])) >= 100
    },
    {
        'desc': 'Top 10 VIP Customers (/api/analytics/top-customers)',
        'url': f'{live_base}/api/analytics/top-customers',
        'validate': lambda d: isinstance(d, dict) and len(d.get('customers', [])) >= 10 and d['customers'][0]['name'] == 'T Vijaya'
    }
]

for tc in test_cases:
    req = urllib.request.Request(tc['url'], headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        passed = tc['validate'](data)
        print(f"[{'PASS' if passed else 'FAIL'}] {tc['desc']}")
        if passed:
            top3 = [f"{c['name']} (₹{c['totalSpent']})" for c in data['customers'][:3]]
            print(f"       Top 3: {', '.join(top3)}")
