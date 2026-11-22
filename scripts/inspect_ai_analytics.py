with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="kpi-container"')
print(text[idx+3000:idx+4500])
