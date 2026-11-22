with open('admin.html', encoding='utf-8') as f:
    lines = f.readlines()

print('--- Context around line 582 ---')
for i in range(570, 600):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')

print('\n--- Context around line 3257 ---')
for i in range(3250, 3290):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
