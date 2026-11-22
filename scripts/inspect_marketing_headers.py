with open('marketing.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
headers = re.findall(r'<h[1-4][^>]*>.*?</h[1-4]>', c)
for h in headers[:15]:
    print(h)
