with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'/api/analytics', text)]
print('Matches in server.js:', len(matches))
for pos in matches[:5]:
    print('--- at', pos, '---')
    print(text[max(0, pos-20):min(len(text), pos+150)])
