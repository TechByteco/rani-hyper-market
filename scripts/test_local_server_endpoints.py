import subprocess, time, json, urllib.request

# Start server.js in background on an alternative test port e.g. 5055
env = dict(subprocess.os.environ)
env['PORT'] = '5055'

proc = subprocess.Popen(['node', 'server.js'], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
time.sleep(2) # Give server 2 seconds to start

base_url = 'http://localhost:5055'
endpoints = [
    '/api/ai/festival-stock-needs?festivalId=karthigai_deepam',
    '/api/ai/festival-stock-needs?festivalId=pongal_harvest',
    '/api/ai/festival-stock-needs?festivalId=maha_shivaratri',
    '/api/ai/festival-stock-needs?festivalId=thai_poosam',
    '/api/ai/festival-stock-needs?festivalId=chithirai_thiruvizha',
    '/api/ai/festival-stock-needs?festivalId=christmas_newyear',
    '/api/ai/festival-calendar-matrix',
    '/api/analytics/top-customers'
]

results = []
for ep in endpoints:
    url = base_url + ep
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            code = response.getcode()
            data = json.loads(response.read().decode('utf-8'))
            results.append({'endpoint': ep, 'status': code, 'success': True, 'count': len(data) if isinstance(data, list) else len(data.get('stockNeedList', []))})
    except Exception as e:
        results.append({'endpoint': ep, 'status': 0, 'success': False, 'error': str(e)})

# Terminate test server
proc.terminate()
try:
    proc.wait(timeout=2)
except:
    proc.kill()

print("Local Server API Endpoint Verification Results:")
print("-" * 80)
for r in results:
    if r['success']:
        print(f"  [HTTP {r['status']}] {r['endpoint']:<60} -> Items: {r['count']}")
    else:
        print(f"  [ERROR] {r['endpoint']:<60} -> {r['error']}")
