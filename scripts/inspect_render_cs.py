with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'renderCrossSellsTable'
idx = c.find(target)
print('Target index:', idx)
if idx != -1:
    print(c[idx:idx+1200])
