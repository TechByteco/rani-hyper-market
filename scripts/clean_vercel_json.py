import json

vj = json.load(open('vercel.json', encoding='utf-8'))
rewrites = vj.get('rewrites', [])

# Remove /api/ rewrites so Vercel uses native Serverless Functions in api/
cleaned_rewrites = [r for r in rewrites if not r.get('source', '').startswith('/api/')]
vj['rewrites'] = cleaned_rewrites

with open('vercel.json', 'w', encoding='utf-8') as f:
    json.dump(vj, f, indent=2)

print('Reverted /api rewrites in vercel.json. Total rewrites now:', len(cleaned_rewrites))
