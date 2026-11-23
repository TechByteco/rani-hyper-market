import filecmp

pairs = [
    ('admin.html', 'public/admin.html'),
    ('store.html', 'public/store.html'),
    ('online-orders.html', 'public/online-orders.html'),
    ('orders.html', 'public/orders.html'),
    ('ai-analytics.html', 'public/ai-analytics.html'),
    ('products_catalog.json', 'public/products_catalog.json'),
    ('rani_products.json', 'public/rani_products.json'),
    ('initial_products.json', 'public/initial_products.json'),
    ('posEnhancementService.js', 'api/posEnhancementService.js'),
    ('analyticsService.js', 'api/analyticsService.js'),
    ('services/googleMerchantSyncService.js', 'api/services/googleMerchantSyncService.js'),
    ('google-merchant-feed.xml', 'public/google-merchant-feed.xml'),
    ('services/digitalSignageService.js', 'api/services/digitalSignageService.js'),
    ('display/overhead-promos.html', 'public/display/overhead-promos.html'),
    ('services/gstComplianceService.js', 'api/services/gstComplianceService.js'),
    ('services/reconciliationService.js', 'api/services/reconciliationService.js'),
    ('reconciliation.html', 'public/reconciliation.html'),
    ('services/procurementService.js', 'api/services/procurementService.js'),
    ('procurement.html', 'public/procurement.html'),
    ('services/rbacAuthService.js', 'api/services/rbacAuthService.js'),
    ('services/deliveryDispatchService.js', 'api/services/deliveryDispatchService.js'),
    ('services/deliveryDriverService.js', 'api/services/deliveryDriverService.js'),
    ('delivery-driver.html', 'public/delivery-driver.html'),
    ('catalog-search.worker.js', 'public/catalog-search.worker.js'),
    ('sw.js', 'public/sw.js'),
    ('audio/chime.mp3', 'public/audio/chime.mp3'),
    ('store_upgrade_module.js', 'public/store_upgrade_module.js'),
    ('services/competitiveIntelligenceService.js', 'api/services/competitiveIntelligenceService.js'),
    ('services/householdConsumptionService.js', 'api/services/householdConsumptionService.js')
]

all_ok = True
for f1, f2 in pairs:
    match = filecmp.cmp(f1, f2, shallow=False)
    print(f"[{'PASS' if match else 'FAIL'}] {f1} <==> {f2} (identical: {match})")
    if not match:
        all_ok = False

print("\nDUAL-COPY PARITY:", "100% PERFECT" if all_ok else "MISMATCH FOUND")
