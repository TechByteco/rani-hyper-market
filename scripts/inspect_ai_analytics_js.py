lines = open('ai-analytics.html', encoding='utf-8').readlines()
for i in range(1150, 1200):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
