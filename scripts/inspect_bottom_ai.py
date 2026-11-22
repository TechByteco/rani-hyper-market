with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

print('File length:', len(c))
print(c[-3500:])
