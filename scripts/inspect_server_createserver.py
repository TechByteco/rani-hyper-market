with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'posEnhancement', text)]
print('posEnhancement occurrences in server.js:', len(matches))
for pos in matches[:5]:
    print('--- at', pos, '---')
    print(text[max(0, pos-40):min(len(text), pos+100)])
