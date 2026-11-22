with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
print('Matches for agent1:', re.findall(r'agent1[^\s\'\",;()]*', c, re.IGNORECASE))
print('Matches for copywriter:', re.findall(r'copywriter[^\s\'\",;()]*', c, re.IGNORECASE))
