lines = open('.gitignore', encoding='utf-8').readlines()
for i in range(8, 25):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
