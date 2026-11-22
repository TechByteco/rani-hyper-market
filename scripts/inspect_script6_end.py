with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('</script>', 97086)
print('Script #6 ends at', idx)
print(repr(c[idx-200:idx+200]))
