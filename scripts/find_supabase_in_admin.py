with open('admin.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'supabase' in l.lower():
        print(f'{i+1}: {l.strip()[:100]}')
