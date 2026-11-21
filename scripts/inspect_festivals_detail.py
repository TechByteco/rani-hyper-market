import os, re, json

with open('festivalMasterData.js', 'r', encoding='utf-8') as f:
    content = f.read()

fest_ids = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', content)
print(f'Total festival IDs in festivalMasterData.js: {len(fest_ids)}')
print('Festival IDs:')
for i, fid in enumerate(fest_ids):
    print(f'  {i+1}. {fid}')

if os.path.exists('mined_festival_empirical_data.json'):
    with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
        mined = json.load(f)
    print(f'\nTotal entries in mined_festival_empirical_data.json: {len(mined)}')
    print('Keys in mined data:', list(mined.keys())[:15])
else:
    print('\nmined_festival_empirical_data.json does not exist')
