with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches = re.findall(r'function load[a-zA-Z0-9_]*', c)
print('Functions starting with load:', set(matches))
