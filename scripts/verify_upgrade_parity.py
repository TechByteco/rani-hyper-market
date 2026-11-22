import filecmp

pairs = [
    ('admin.html', 'public/admin.html'),
    ('online-orders.html', 'public/online-orders.html'),
    ('store.html', 'public/store.html'),
    ('ai-analytics.html', 'public/ai-analytics.html'),
    ('posEnhancementService.js', 'api/posEnhancementService.js')
]

all_match = True
for f1, f2 in pairs:
    match = filecmp.cmp(f1, f2, shallow=False)
    print(f"[{'PASS' if match else 'FAIL'}] {f1} <==> {f2} (identical: {match})")
    if not match:
        all_match = False

print("\nDUAL COPY PARITY VERIFICATION:", "100% PERFECT" if all_match else "MISMATCH FOUND")
