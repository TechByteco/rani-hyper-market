import json

vj = json.load(open('vercel.json', encoding='utf-8'))
rewrites = vj.get('rewrites', [])

api_rewrites = [
    {"source": "/api/sync/:path*", "destination": "/api/index.js"},
    {"source": "/api/webhooks/:path*", "destination": "/api/index.js"},
    {"source": "/api/inventory/:path*", "destination": "/api/index.js"},
    {"source": "/api/pos/:path*", "destination": "/api/index.js"},
    {"source": "/api/notifications/:path*", "destination": "/api/index.js"},
    {"source": "/api/orders/:path*", "destination": "/api/index.js"}
]

# Prepend API rewrites so they take precedence
new_rewrites = api_rewrites + [r for r in rewrites if not r.get('source', '').startswith('/api/')]
vj['rewrites'] = new_rewrites

with open('vercel.json', 'w', encoding='utf-8') as f:
    json.dump(vj, f, indent=2)

print('Updated vercel.json with API sub-route rewrites.')
