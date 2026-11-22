lines = open('api/index.js', encoding='utf-8').readlines()
for i, l in enumerate(lines):
    if '/api/analytics/' in l:
        print(f'{i+1}: {l.strip()[:100]}')
