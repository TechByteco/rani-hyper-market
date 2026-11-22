with open('marketing.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'function renderCurrentChannelPreview'
idx = c.find(target)
print('Target index:', idx)
if idx != -1:
    print(c[idx:idx+2500])
