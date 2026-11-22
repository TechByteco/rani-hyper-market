import urllib.request, json

supabase_url = 'https://lofykatlypiywrziwtdp.supabase.co'
supabase_key = 'sb_publishable_8-vFFctJnZYUTZFCmV2rqg_LgHuYjrn'

req = urllib.request.Request(
    f"{supabase_url}/rest/v1/",
    headers={
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}'
    }
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"OpenAPI Schema status: HTTP {resp.status}")
        spec = json.loads(resp.read().decode())
        definitions = spec.get('definitions', {})
        paths = spec.get('paths', {})
        print(f"\nDiscovered {len(definitions)} tables/views in Supabase:")
        for tname in sorted(definitions.keys()):
            cols = list(definitions[tname].get('properties', {}).keys())
            print(f"  - {tname}: {len(cols)} columns ({', '.join(cols[:6])})")
        
        # Save OpenAPI schema
        with open('data/supabase_openapi_schema.json', 'w', encoding='utf-8') as f:
            json.dump(spec, f, indent=2)
        print("\nSaved OpenAPI spec to data/supabase_openapi_schema.json")
except Exception as e:
    print("Failed to fetch OpenAPI spec:", e)
