with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<!-- Right Quick Actions -->')
print(text[idx:idx+1000])
