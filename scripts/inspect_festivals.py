import re

with open('festivalMasterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Match festival blocks
pattern = re.compile(r"id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"]")
festivals = pattern.findall(text)
print(f"Total Festivals defined: {len(festivals)}")
for i, (fid, fname) in enumerate(festivals):
    print(f"{i+1:2d}. {fid:<25} : {fname}")
