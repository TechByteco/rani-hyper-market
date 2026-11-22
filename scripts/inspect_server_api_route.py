with open('server.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '/api/ai-marketing/generate'
idx = c.find(target)
print('Target index:', idx)
print(c[idx-50:idx+600])
