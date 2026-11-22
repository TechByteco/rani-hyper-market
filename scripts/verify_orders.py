import json

orders = json.load(open('data/online_orders.json', encoding='utf-8'))
for o in orders:
    if 'status' not in o:
        o['status'] = 'delivered' if 'PAID' in str(o.get('payment_status', '')) else 'completed'
    if 'payment_status' not in o:
        o['payment_status'] = 'PAID (Cash at Counter)'

with open('data/online_orders.json', 'w', encoding='utf-8') as f:
    json.dump(orders, f, indent=2)
with open('public/online_orders.json', 'w', encoding='utf-8') as f:
    json.dump(orders, f, indent=2)

print(f'Total orders: {len(orders)}')
for o in orders:
    print(f"{o['id']} | {o['customer_name']} | {o.get('phone','')} | Rs {o['total_amount']} | {o['status']} | {o.get('created_at','')[:19]}")
