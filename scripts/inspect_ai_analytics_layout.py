with open('ai-analytics.html', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in ai-analytics.html: {len(lines)}")
for i, l in enumerate(lines):
    if '<h' in l.lower() or 'section' in l.lower() or 'module' in l.lower() or 'card' in l.lower():
        if any(w in l.lower() for w in ['zero-waste', 'festival', 'kpi', 'predictive', 'inventory', 'velocity', 'autonomous']):
            print(f'{i+1}: {l.strip()[:100]}')
