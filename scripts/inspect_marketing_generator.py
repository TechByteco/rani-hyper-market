with open('marketing.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = '/api/ai-marketing/generate'
idx = c.find(target)
print('Target index in marketing.html:', idx)
if idx != -1:
    print(c[idx-300:idx+600])
