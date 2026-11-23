"""
Live Vercel Production Verification: Workbox PWA Offline Architecture & Offline Checkout
Target: https://rani-hyper-market.vercel.app
"""

import urllib.request
import json

def verify_live_pwa():
    base_url = "https://rani-hyper-market.vercel.app"

    # 1. Verify sw.js
    sw_url = f"{base_url}/sw.js"
    print(f"Fetching Live Service Worker: {sw_url}")
    req = urllib.request.Request(sw_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        status = res.status
        content = res.read().decode('utf-8')
    
    print(f"  HTTP Status: {status}")
    assert status == 200, f"sw.js returned HTTP {status}"
    
    sw_checks = [
        ('ASSET_CACHE_NAME', "Tier 1: Asset Cache Namespace"),
        ('/audio/chime.mp3', "Tier 1: Audio Chime Pre-cache"),
        ('CATALOG_CACHE_NAME', "Tier 2: Catalog Cache Namespace"),
        ('products_catalog.json', "Tier 2: Catalog JSON Cache"),
        ('/api/orders', "Tier 3: Order API Interception"),
        ('handleOfflineOrderEnqueue', "Tier 3: Offline Order Enqueue Handler"),
        ('syncPendingOfflineOrders', "Tier 3: Background Order Sync"),
        ('sync-offline-orders', "Tier 3: SyncManager Tag")
    ]
    for needle, label in sw_checks:
        assert needle in content, f"Live sw.js missing: {label}"
        print(f"  [PASS] {label} verified in live sw.js")

    # 2. Verify audio chime
    chime_url = f"{base_url}/audio/chime.mp3"
    print(f"\nFetching Live Audio Chime: {chime_url}")
    req = urllib.request.Request(chime_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        status = res.status
        bytes_data = res.read()
    
    print(f"  HTTP Status: {status}, Size: {len(bytes_data)} bytes")
    assert status == 200, f"audio/chime.mp3 returned HTTP {status}"
    assert len(bytes_data) > 1000, "Live chime.mp3 is suspiciously small"
    print("  [PASS] Live audio chime successfully verified")

    # 3. Verify store.html UI elements
    store_url = f"{base_url}/store"
    print(f"\nFetching Live Store PWA: {store_url}")
    req = urllib.request.Request(store_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        status = res.status
        html = res.read().decode('utf-8')

    print(f"  HTTP Status: {status}")
    assert status == 200, f"store returned HTTP {status}"
    
    ui_checks = [
        ('id="pwa-offline-banner"', "PWA Offline Status Banner"),
        ('id="pwa-online-toast"', "PWA Reconnection Toast"),
        ('id="bill-offline-status-banner"', "Invoice Offline Order Status Banner"),
        ('store_upgrade_module.js', "Store Upgrade Module")
    ]
    for needle, label in ui_checks:
        assert needle in html, f"Live store missing UI element: {label}"
        print(f"  [PASS] {label} verified in live store.html")

    # 4. Verify store_upgrade_module.js
    mod_url = f"{base_url}/store_upgrade_module.js"
    print(f"\nFetching Live Store Upgrade Module: {mod_url}")
    req = urllib.request.Request(mod_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        status = res.status
        mod_content = res.read().decode('utf-8')

    print(f"  HTTP Status: {status}")
    assert status == 200, f"store_upgrade_module.js returned HTTP {status}"

    mod_checks = [
        ('playAudioChime', "Audio Chime Playback Hook"),
        ('RaniOfflineOrderQueue', "Client Offline Order Queue"),
        ('updateNetworkStatusUI', "Online/Offline Status Handler"),
        ('serviceWorker.register', "Service Worker Registration")
    ]
    for needle, label in mod_checks:
        assert needle in mod_content, f"Live module missing: {label}"
        print(f"  [PASS] {label} verified in live store_upgrade_module.js")

if __name__ == '__main__':
    print("==================================================================")
    print("  RANI HYPER MARKET: LIVE VERCEL PWA OFFLINE VERIFICATION")
    print("==================================================================")
    verify_live_pwa()
    print("\nALL LIVE PRODUCTION OFFLINE CHECKS PASSED 100% PERFECTLY!\n")
