with open('analyticsService.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'stock|velocity|inventory|reorder', text, re.IGNORECASE)]
print('Matches in analyticsService.js:', len(matches))
for pos in matches[:6]:
    print('--- at', pos, '---')
    print(text[max(0, pos-40):min(len(text), pos+140)])
