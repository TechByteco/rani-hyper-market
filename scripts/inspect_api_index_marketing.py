with open('api/index.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '/api/ai-marketing/generate'
idx = c.find(target)
print('Target index in api/index.js:', idx)
if idx != -1:
    print(c[idx-50:idx+600])
