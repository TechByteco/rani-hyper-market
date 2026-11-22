import urllib.request

req = urllib.request.Request('https://rani-hyper-market.vercel.app/admin.html', headers={'User-Agent': 'Test/1.0'})
try:
    with urllib.request.urlopen(req) as res:
        html = res.read().decode('utf-8', errors='ignore')
        if 'Direct Vercel Delta Pipeline Active' in html:
            print('-> Vercel is serving NEW COMMIT with Direct Vercel Delta Pipeline!')
        elif 'Supabase Cloud Synced' in html:
            print('-> Vercel is STILL SERVING PREVIOUS DEPLOYMENT (Supabase Cloud Synced). Build is in progress...')
        else:
            print('-> Could not find either string in live admin.html.')
except Exception as e:
    print('Error:', e)
