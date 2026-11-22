with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
scripts = [m.start() for m in re.finditer(r'<script', c)]
print('Number of script tags:', len(scripts))
for idx in scripts:
    print('Script at', idx, repr(c[idx:idx+60]))
