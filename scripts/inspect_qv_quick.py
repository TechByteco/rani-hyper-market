with open('store.html', 'r', encoding='utf-8') as f:
    c = f.read()
target = "document.getElementById('product-quick-view-modal').classList.remove('hidden');"
idx = c.find(target)
print(c[idx:idx+800])
