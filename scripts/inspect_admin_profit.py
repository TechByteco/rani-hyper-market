with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = 38948
print(text[pos-200:pos+500])
