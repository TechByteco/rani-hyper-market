import re

with open('marketing.html', 'r', encoding='utf-8') as f:
    c = f.read()

print('Length of marketing.html:', len(c))
matches = re.findall(r'gemini[a-zA-Z0-9_\-\.]*', c, re.IGNORECASE)
print('Gemini references:', set(matches))
matches_api = re.findall(r'/api/[a-zA-Z0-9_\-/]+', c)
print('API routes in marketing.html:', set(matches_api))
