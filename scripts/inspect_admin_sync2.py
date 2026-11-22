with open('admin.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(3510, 3600):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
