lines = open('api/index.js', encoding='utf-8').readlines()
for i in range(1370, 1395):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
