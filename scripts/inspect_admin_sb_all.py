lines = open('admin.html', encoding='utf-8').readlines()
for i, l in enumerate(lines):
    if 'supabase' in l.lower():
        print(f'Line {i+1}: {l.strip()[:100]}')
