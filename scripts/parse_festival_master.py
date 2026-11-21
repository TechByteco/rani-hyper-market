import re, json

with open('festivalMasterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract items from FESTIVAL_MASTER array
# We can do this cleanly in node or python
items = []
pattern = re.compile(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"]', re.MULTILINE)
matches = pattern.findall(text)
print(f'Total matched: {len(matches)}')
for m in matches:
    print(f'{m[0]}: {m[1]}')
