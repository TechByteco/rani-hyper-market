lines = open('server.js', encoding='utf-8').readlines()
for i in range(585, 610):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
