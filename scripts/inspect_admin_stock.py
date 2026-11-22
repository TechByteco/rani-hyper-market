with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function renderInventoryList(items)')
print(text[idx+1500:idx+3000])
