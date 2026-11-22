with open('online-orders.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('sendStatusNotificationWhatsApp')
print(text[idx:idx+800])
