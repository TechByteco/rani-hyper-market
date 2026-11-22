for fname in ['server.js', 'api/index.js']:
    lines = open(fname, encoding='utf-8').readlines()
    print(f'=== {fname} ===')
    for i, l in enumerate(lines):
        if '/api/auth' in l:
            for j in range(max(0, i-2), min(len(lines), i+25)):
                print(f'{j+1}: {lines[j]}', end='')
            print('---')
