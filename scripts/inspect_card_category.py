with open('store.html', 'r', encoding='utf-8') as f:
    c = f.read()
target = '<span class="text-emerald-700 uppercase tracking-wider font-extrabold truncate max-w-[130px]">${p.category || \'GROCERY\'}</span>'
idx = c.find(target)
print('Target index:', idx)
if idx != -1:
    print(c[idx-100:idx+400])
