with open('admin.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(6945, 6975):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
