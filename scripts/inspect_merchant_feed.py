with open('generate_merchant_feed.js', 'r', encoding='utf-8') as f:
    c = f.read()

print('Length of generate_merchant_feed.js:', len(c))
print(c[:1500])
