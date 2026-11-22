lines = open('admin.html', encoding='utf-8').readlines()
for i in range(5220, 5245):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
