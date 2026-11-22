lines = open('api/index.js', encoding='utf-8').readlines()
for i in range(50):
    print(f'{i+1}: {lines[i]}', end='')
