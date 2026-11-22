with open('posEnhancementService.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('async function syncPushSales')
print(text[idx:idx+1200])
