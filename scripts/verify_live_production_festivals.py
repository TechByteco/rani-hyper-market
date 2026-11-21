import urllib.request, json

live_base = 'https://rani-hyper-market.vercel.app'

test_cases = [
    {
        'desc': 'Karthigai Deepam (2026-11-24 celebration vs 2026-11-18 cutoff)',
        'url': f'{live_base}/api/ai/festival-stock-needs?festivalId=karthigai_deepam',
        'validate': lambda d: d.get('date2026') == '2026-11-24' and d.get('cutoff2026') == '2026-11-18' and len(d.get('stockNeedList', [])) >= 10
    },
    {
        'desc': 'Thai Pongal (2026-01-15 celebration vs 2026-01-08 cutoff)',
        'url': f'{live_base}/api/ai/festival-stock-needs?festivalId=pongal_harvest',
        'validate': lambda d: d.get('date2026') == '2026-01-15' and d.get('cutoff2026') == '2026-01-08' and len(d.get('stockNeedList', [])) >= 10
    },
    {
        'desc': 'Maha Shivaratri (2026-02-15 celebration vs 2026-02-10 cutoff)',
        'url': f'{live_base}/api/ai/festival-stock-needs?festivalId=maha_shivaratri',
        'validate': lambda d: d.get('date2026') == '2026-02-15' and d.get('cutoff2026') == '2026-02-10' and len(d.get('stockNeedList', [])) >= 10
    },
    {
        'desc': 'Chithirai Thiruvizha (2026-04-29 celebration vs 2026-04-20 cutoff)',
        'url': f'{live_base}/api/ai/festival-stock-needs?festivalId=chithirai_thiruvizha',
        'validate': lambda d: d.get('date2026') == '2026-04-29' and d.get('cutoff2026') == '2026-04-20' and len(d.get('stockNeedList', [])) >= 10
    },
    {
        'desc': 'Navaratri Sundal Days (2026-10-11 celebration vs 2026-10-05 cutoff)',
        'url': f'{live_base}/api/ai/festival-stock-needs?festivalId=navaratri_sundal_days',
        'validate': lambda d: d.get('date2026') == '2026-10-11' and d.get('cutoff2026') == '2026-10-05' and len(d.get('stockNeedList', [])) >= 10
    },
    {
        'desc': 'Christmas Grand Day (2026-12-25 celebration vs 2026-12-18 cutoff)',
        'url': f'{live_base}/api/ai/festival-stock-needs?festivalId=christmas_newyear',
        'validate': lambda d: d.get('date2026') == '2026-12-25' and d.get('cutoff2026') == '2026-12-18' and len(d.get('stockNeedList', [])) >= 10
    },
    {
        'desc': 'Festival Calendar Matrix (34 festivals full dataset)',
        'url': f'{live_base}/api/ai/festival-calendar-matrix',
        'validate': lambda d: isinstance(d, list) and len(d) == 34 and d[0].get('dates') is not None
    },
    {
        'desc': 'Customer CRM Endpoints (/api/analytics/customers)',
        'url': f'{live_base}/api/analytics/customers',
        'validate': lambda d: isinstance(d, list) and len(d) >= 100
    },
    {
        'desc': 'Top 10 VIP Customers (/api/analytics/top-customers)',
        'url': f'{live_base}/api/analytics/top-customers',
        'validate': lambda d: isinstance(d, list) and len(d) == 10
    }
]

print("Verifying Live Production Endpoints on https://rani-hyper-market.vercel.app:")
print("=" * 80)

all_passed = True
for tc in test_cases:
    try:
        req = urllib.request.Request(tc['url'], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as res:
            status = res.getcode()
            body = res.read().decode('utf-8')
            data = json.loads(body)
            passed = tc['validate'](data)
            if passed:
                print(f" [PASS] {tc['desc']}")
                if isinstance(data, dict):
                    print(f"        Date: {data.get('date2026')}, Cutoff: {data.get('cutoff2026')}, Items: {len(data.get('stockNeedList', []))}")
                    top3 = [it['name'] for it in data.get('stockNeedList', [])[:3]]
                    print(f"        Top SKUs: {'; '.join(top3)}")
                elif isinstance(data, list):
                    print(f"        Count: {len(data)} records")
            else:
                print(f" [FAIL] Validation returned False for {tc['desc']}")
                all_passed = False
    except Exception as e:
        print(f" [ERROR] {tc['desc']} -> {str(e)}")
        all_passed = False

if all_passed:
    print("\nALL LIVE PRODUCTION VERIFICATIONS PASSED 100%!")
else:
    print("\nSOME PRODUCTION TESTS FAILED!")
