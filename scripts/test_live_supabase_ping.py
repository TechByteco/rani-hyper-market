import urllib.request, json, time

supabase_url = 'https://lofykatlypiywrziwtdp.supabase.co'
supabase_key = 'sb_publishable_8-vFFctJnZYUTZFCmV2rqg_LgHuYjrn'

print("Pinging Supabase:", supabase_url)
t0 = time.time()
try:
    req = urllib.request.Request(
        f"{supabase_url}/rest/v1/orders?select=id&limit=1",
        headers={
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json'
        }
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        elapsed = time.time() - t0
        print(f"Supabase responded: HTTP {resp.status} in {elapsed:.2f}s")
        data = resp.read().decode()
        print("Data preview:", data[:200])
except Exception as e:
    elapsed = time.time() - t0
    print(f"Supabase FAILED after {elapsed:.2f}s: {e}")
