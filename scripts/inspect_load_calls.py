import re
with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'loadAllAnalytics()'
for m in re.finditer(re.escape(target), c):
    print('Match at', m.start(), repr(c[m.start()-50:m.start()+150]))
