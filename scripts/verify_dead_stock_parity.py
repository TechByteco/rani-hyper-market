import filecmp
import os

checks = [
    ('ai-analytics.html', 'public/ai-analytics.html'),
    ('services/deadStockRecoveryService.js', 'api/services/deadStockRecoveryService.js'),
    ('services/deadStockRecoveryService.d.ts', 'api/services/deadStockRecoveryService.d.ts'),
    ('dead_stock_bundles.json', 'data/dead_stock_bundles.json'),
    ('dead_stock_bundles.json', 'public/dead_stock_bundles.json'),
    ('dead_stock_bundles.json', 'api/data/dead_stock_bundles.json')
]

print("=== VERIFYING DUAL-COPY PARITY FOR DEAD-STOCK MODULE ===")
all_pass = True
for f1, f2 in checks:
    eq = filecmp.cmp(f1, f2, shallow=False)
    print(f"[{'PASS' if eq else 'FAIL'}] {f1} <==> {f2} ({os.path.getsize(f1)} bytes)")
    if not eq: all_pass = False

print(f"\nOVERALL RESULT: {'100% PERFECT PARITY' if all_pass else 'MISMATCH DETECTED'}")
