with open('analyticsService.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '17,547' in l or '17547' in l or '7,179' in l or '7179' in l:
        print(f'{i+1}: {l.strip()[:100]}')
