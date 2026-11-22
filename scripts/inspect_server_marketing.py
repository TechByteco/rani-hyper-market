with open('server.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '/api/ai-marketing/generate'
idx = c.find(target)
if idx != -1:
    print('Found in server.js at', idx)
    print(c[idx-50:idx+1000])
else:
    print('Not found in server.js')
