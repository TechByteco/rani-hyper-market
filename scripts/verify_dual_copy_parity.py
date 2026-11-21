import os, filecmp

pairs = [
    ('festivalMasterData.js', 'public/festivalMasterData.js'),
    ('festivalMasterData.js', 'api/festivalMasterData.js'),
    ('mined_festival_empirical_data.json', 'public/mined_festival_empirical_data.json'),
    ('mined_festival_empirical_data.json', 'api/mined_festival_empirical_data.json'),
    ('admin.html', 'public/admin.html'),
    ('ai-analytics.html', 'public/ai-analytics.html')
]

all_match = True
for f1, f2 in pairs:
    if not os.path.exists(f1) or not os.path.exists(f2):
        print(f"[FAIL] Missing file: {f1} or {f2}")
        all_match = False
        continue
    match = filecmp.cmp(f1, f2, shallow=False)
    if match:
        print(f"[OK] Parity MATCH: {f1} == {f2} ({os.path.getsize(f1)} bytes)")
    else:
        print(f"[FAIL] Parity MISMATCH: {f1} ({os.path.getsize(f1)} bytes) != {f2} ({os.path.getsize(f2)} bytes)")
        all_match = False

if all_match:
    print("\nALL DUAL-COPY FILES ARE IN 100% EXACT PARITY!")
else:
    print("\nPARITY ERRORS DETECTED!")
