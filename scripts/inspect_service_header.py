with open('posEnhancementService.js', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(25):
    print(f'{i+1}: {lines[i]}', end='')
