lines = open('posEnhancementService.js', encoding='utf-8').readlines()
for i in range(18, 40):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}', end='')
