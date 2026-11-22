with open('store.html', 'r', encoding='utf-8') as f:
    c = f.read()
target = "loadStoreProducts();"
idx = c.find(target)
print('Target index:', idx)
if idx != -1:
    print(c[idx-100:idx+300])
