lines = open('online-orders.html', encoding='utf-8').readlines()
found = False
for i, l in enumerate(lines):
    if 'supabase' in l.lower():
        print(f'Line {i+1}: {l.strip()[:100]}')
        found = True
if not found:
    print('Zero references to Supabase in online-orders.html!')
