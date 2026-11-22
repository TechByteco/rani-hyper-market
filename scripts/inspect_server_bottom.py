lines = open('server.js', encoding='utf-8').readlines()
for i in range(len(lines)-30, len(lines)):
    print(f'{i+1}: {lines[i]}', end='')
