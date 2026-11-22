import os, glob

matches = {}
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', 'node_modules', 'supabase_dump', 'venv', '.gemini']):
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.json', '.env', '.env.local')):
            fpath = os.path.join(root, file)
            try:
                txt = open(fpath, encoding='utf-8').read()
                cnt = txt.lower().count('supabase')
                if cnt > 0:
                    matches[fpath] = cnt
            except:
                pass

for k, v in sorted(matches.items(), key=lambda x: -x[1]):
    print(f'{k}: {v} occurrences')
