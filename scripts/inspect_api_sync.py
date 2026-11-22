with open('api/index.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '/api/sync' in l:
        for j in range(max(0, i-2), min(len(lines), i+25)):
            print(f'{j+1}: {lines[j]}', end='')
        print('---')
