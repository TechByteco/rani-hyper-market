with open('marketing.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'preview-headline'
idx = c.find(target)
print('Target index:', idx)
print(c[idx-800:idx+800])
