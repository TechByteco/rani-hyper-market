with open('store.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = 206505
print(text[pos-200:pos+800])
