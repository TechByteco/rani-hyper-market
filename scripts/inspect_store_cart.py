with open('store.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = 206556
print(text[pos-400:pos+200])
