with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.rfind('<script')
print('Last script starts at', idx)
print(c[idx:idx+2500])
