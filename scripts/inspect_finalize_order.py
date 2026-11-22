with open('store.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('async function completeAndRenderOrder')
print(text[idx:idx+1500])
