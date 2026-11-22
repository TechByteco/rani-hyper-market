with open('store.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(k in l for k in ['high_affinity', 'cross_sell', 'bundle', 'combo', 'Super Saver']):
        print(f"Line {i+1}: {l.strip()[:100]}")
