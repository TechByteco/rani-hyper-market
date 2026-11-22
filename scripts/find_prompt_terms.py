import os, glob

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', 'node_modules', 'venv', '.gemini']):
        continue
    for f in files:
        if f.endswith(('.py', '.js', '.json', '.md', '.txt')):
            fpath = os.path.join(root, f)
            try:
                txt = open(fpath, encoding='utf-8', errors='ignore').read()
                if '17,547' in txt or '17547' in txt or '7,179' in txt or '7179' in txt:
                    print('Match in:', fpath)
            except:
                pass
