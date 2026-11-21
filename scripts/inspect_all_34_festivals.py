import json, os, subprocess

cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS.map(f => ({ id: f.id, name: f.name, tamil: f.tamilName, month: f.month, rule: f.calendarRule, datesByYear: f.datesByYear }))));']
out = subprocess.check_output(cmd, encoding='utf-8')
festivals = json.loads(out.strip())

print(f"Total festivals loaded: {len(festivals)}")
for idx, f in enumerate(festivals):
    dby = f.get('datesByYear', {})
    d2023 = dby.get('2023', {})
    d2024 = dby.get('2024', {})
    d2025 = dby.get('2025', {})
    d2026 = dby.get('2026', {})
    print(f"{idx+1}. [{f['id']}] {f['name']}")
    print(f"    Rule: {f.get('rule')}")
    print(f"    2023: {d2023.get('date') if isinstance(d2023, dict) else d2023} | win: {d2023.get('window') if isinstance(d2023, dict) else ''}")
    print(f"    2024: {d2024.get('date') if isinstance(d2024, dict) else d2024} | win: {d2024.get('window') if isinstance(d2024, dict) else ''}")
    print(f"    2025: {d2025.get('date') if isinstance(d2025, dict) else d2025} | win: {d2025.get('window') if isinstance(d2025, dict) else ''}")
    print(f"    2026: {d2026.get('date') if isinstance(d2026, dict) else d2026} | cutoff: {d2026.get('cutoff') if isinstance(d2026, dict) else ''}")
