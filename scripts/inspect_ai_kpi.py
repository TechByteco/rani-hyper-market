lines = open('ai-analytics.html', encoding='utf-8').readlines()
for i in range(240, 330):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
