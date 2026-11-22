with open('admin.html', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'function [a-zA-Z0-9_]*sync[a-zA-Z0-9_]*\([^)]*\)', text, re.IGNORECASE)
print('Sync functions in admin.html:', matches)

matches2 = re.findall(r'fetch\([\'\"][^\'\"]*sync[^\'\"]*[\'\"]', text)
print('Sync fetches in admin.html:', set(matches2))

# Also search for supabase in admin.html
sb_matches = [m.start() for m in re.finditer(r'supabase', text, re.I)]
print('Supabase occurrences in admin.html:', len(sb_matches))
for pos in sb_matches[:5]:
    print('  Context:', text[max(0, pos-40):min(len(text), pos+60)].replace('\n', ' '))
