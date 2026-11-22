with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'Combo: ₹${p.merchandising_strategy.bundle_offer_price}'
idx = c.find(target)
print('Target index:', idx)
if idx != -1:
    print(repr(c[idx-50:idx+250]))
