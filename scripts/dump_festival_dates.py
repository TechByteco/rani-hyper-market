import json, subprocess

cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS));']
out = subprocess.check_output(cmd, encoding='utf-8')
festivals = json.loads(out.strip())

print(f"Loaded {len(festivals)} festivals from festivalMasterData.js")

for f in festivals:
    fid = f['id']
    dby = f.get('datesByYear', {})
    print(f"\n[{fid}] {f['name']}")
    print(f"  Tamil: {f.get('tamilName')}")
    print(f"  Rule: {f.get('calendarRule')}")
    for y in ['2023', '2024', '2025', '2026', '2027']:
        info = dby.get(y)
        if isinstance(info, dict):
            print(f"    {y}: date={info.get('date')}, cutoff={info.get('cutoff')}, win={info.get('window')}")
        else:
            print(f"    {y}: {info}")
