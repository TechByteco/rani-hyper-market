with open('marketing.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'Synthesizing Retail AI...'
idx = c.find(target)
print('Target index:', idx)
# search upwards for section or card id
print(c[idx-2500:idx-1000])
