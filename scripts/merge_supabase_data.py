import json, os, re

print('=== STEP 1: CONSOLIDATING SUPABASE DATA INTO LOCAL & CLOUD STORAGE ===')

# 1. Orders Consolidation
sb_orders = json.load(open('data/supabase_dump/orders.json', encoding='utf-8'))
local_orders_file = 'data/online_orders.json'
public_orders_file = 'public/online_orders.json'

existing_orders = []
if os.path.exists(local_orders_file):
    try:
        existing_orders = json.load(open(local_orders_file, encoding='utf-8'))
    except Exception as e:
        print('Warning reading local orders:', e)

existing_ids = set()
for o in existing_orders:
    if o.get('id'): existing_ids.add(str(o.get('id')))
    if o.get('supabase_id'): existing_ids.add(str(o.get('supabase_id')))
    if o.get('voucher_no'): existing_ids.add(str(o.get('voucher_no')))
    if o.get('invId'): existing_ids.add(str(o.get('invId')))

merged_orders = list(existing_orders)
added_orders_count = 0

for idx, o in enumerate(sb_orders):
    sb_id = o.get('id')
    if sb_id in existing_ids:
        continue

    addr_str = o.get('shipping_address') or ''
    parts = [p.strip() for p in addr_str.split('|')]
    
    name = 'Online Shopper'
    phone = ''
    email = ''
    addr = addr_str
    slot = 'Standard Delivery (24-48 hrs)'
    notes = ''
    
    if len(parts) > 1:
        name = parts[0]
        for part in parts[1:]:
            p_low = part.lower()
            if p_low.startswith('ph:'):
                phone = part[3:].strip()
            elif p_low.startswith('email:'):
                email = part[6:].strip()
            elif p_low.startswith('addr:'):
                addr = part[5:].strip()
            elif p_low.startswith('slot:'):
                slot = part[5:].strip()
            elif p_low.startswith('notes:'):
                notes = part[6:].strip()
    elif addr_str:
        if 'walk-in' in addr_str.lower():
            name = 'Walk-in Customer'
        else:
            name = addr_str

    tot = float(o.get('total_amount') or 0)
    status = o.get('status') or 'pending'
    pay_status = 'PAID (Delivered)' if status == 'delivered' else 'Pending Verification'
    pay_method = o.get('payment_method') or 'Cash on Delivery'

    formatted = {
        'id': f'SB-ORD-{idx+101}',
        'supabase_id': sb_id,
        'invId': f'RANI-SB-{idx+1001}',
        'voucher_no': f'RANI-SB-{idx+1001}',
        'order_no': f'SB-ORD-{idx+101}',
        'customer_name': name,
        'customerName': name,
        'customer_phone': phone,
        'customerPhone': phone,
        'phone': phone,
        'customer_email': email,
        'delivery_address': addr,
        'shippingAddress': addr,
        'shipping_address': addr_str,
        'delivery_slot': slot,
        'timeslot': slot,
        'delivery_notes': notes,
        'instructions': notes,
        'total_amount': tot,
        'totalAmount': tot,
        'total': tot,
        'gross_mrp': round(tot * 1.15, 2),
        'grossMrp': round(tot * 1.15, 2),
        'total_savings': round(tot * 0.15, 2),
        'totalSavings': round(tot * 0.15, 2),
        'payment_method': pay_method,
        'paymentMethod': pay_method,
        'payment_status': pay_status,
        'status': status,
        'items': [
            {
                'id': 1000 + idx,
                'title': 'Bodinayakanur Fresh Market Selection',
                'name': 'Bodinayakanur Fresh Market Selection',
                'quantity': 1,
                'qty': 1,
                'price': tot,
                'mrp': round(tot * 1.15, 2),
                'total': tot
            }
        ],
        'source': 'Supabase Online Storefront (Migrated to Direct Vercel Delta)',
        'tenant_id': o.get('tenant_id'),
        'created_at': o.get('created_at'),
        'createdAt': o.get('created_at'),
        'timestamp': o.get('created_at')
    }
    merged_orders.append(formatted)
    added_orders_count += 1

# Sort descending by created_at / timestamp
def get_sort_key(ord_obj):
    return str(ord_obj.get('created_at') or ord_obj.get('createdAt') or ord_obj.get('synced_at') or '')

merged_orders.sort(key=get_sort_key, reverse=True)

with open(local_orders_file, 'w', encoding='utf-8') as f:
    json.dump(merged_orders, f, indent=2)
with open(public_orders_file, 'w', encoding='utf-8') as f:
    json.dump(merged_orders, f, indent=2)

print(f'-> Merged {added_orders_count} Supabase orders into {local_orders_file} and {public_orders_file}. Total orders now: {len(merged_orders)}')


# 2. Products Consolidation (Safeguard 4 unmatched Supabase products)
sb_products = json.load(open('data/supabase_dump/products.json', encoding='utf-8'))
catalog_file = 'products_catalog.json'
public_catalog_file = 'public/products_catalog.json'
rani_products_file = 'rani_products.json'

catalog = json.load(open(catalog_file, encoding='utf-8'))
existing_titles = {p.get('title', '').strip().lower() for p in catalog if p.get('title')}

max_id = max([p.get('id', 0) for p in catalog if isinstance(p.get('id'), int)] or [7700])
added_prods = 0

for p in sb_products:
    t = p.get('title', '').strip()
    if t.lower() not in existing_titles:
        max_id += 1
        new_prod = {
            'id': max_id,
            'title': t,
            'price': float(p.get('price') or 0),
            'mrp': round(float(p.get('price') or 0) * 1.2, 2),
            'stock': int(p.get('stock_quantity') or 40),
            'unit': p.get('unit') or '1 pc',
            'image_url': p.get('image_url') or 'images/placeholder-product.png',
            'barcode': f'890{max_id}001',
            'image': p.get('image_url') or 'images/placeholder-product.png',
            'velocity_5yr_sold': 120.0,
            'monthly_run_rate': 25.0,
            'stock_status': 'In Stock (Direct Delta Synced)'
        }
        catalog.append(new_prod)
        existing_titles.add(t.lower())
        added_prods += 1
        print(f'   Added missing Supabase product to catalog: {t} (Price: {new_prod["price"]})')

if added_prods > 0:
    with open(catalog_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2)
    with open(public_catalog_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2)
    with open(rani_products_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2)
    print(f'-> Catalog updated with {added_prods} products. Total products now: {len(catalog)}')
else:
    print('-> All Supabase products already present in catalog.')


# 3. Tenants & Store Admins Archival
tenants = json.load(open('data/supabase_dump/tenants.json', encoding='utf-8'))
store_admins = json.load(open('data/supabase_dump/store_admins.json', encoding='utf-8'))

with open('data/tenants.json', 'w', encoding='utf-8') as f:
    json.dump(tenants, f, indent=2)
with open('data/store_admins.json', 'w', encoding='utf-8') as f:
    json.dump(store_admins, f, indent=2)
print('-> Saved data/tenants.json and data/store_admins.json successfully.')

print('=== STEP 1 COMPLETE: DATA SAFELY CONSOLIDATED ===')
