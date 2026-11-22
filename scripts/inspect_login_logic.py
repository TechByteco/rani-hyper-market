lines = open('login.html', encoding='utf-8').readlines()
for i in range(800, min(len(lines), 930)):
    print(f'{i+1}: {lines[i]}', end='')
