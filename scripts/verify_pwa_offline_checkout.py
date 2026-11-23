"""
Verification Suite: Workbox PWA Offline Architecture & 100% Offline Checkout Strategy
Rani Hyper Market (SNS Market) — Main Road, Bodinayakanur & Theni District
"""

import os
import sys
import json
import subprocess

def test_sw_script_structure():
    print("\n--- 1. Testing sw.js 3-Tier Caching Architecture ---")
    with open('sw.js', 'r', encoding='utf-8') as f:
        sw_code = f.read()

    checks = [
        # Tier 1: Cache-First Asset Cache
        ('ASSET_CACHE_NAME', "Tier 1: Asset Cache Namespace"),
        ('/audio/chime.mp3', "Tier 1: Audio Chime Pre-cache"),
        ('/catalog-search.worker.js', "Tier 1: Worker Pre-cache"),
        ('STATIC_APP_SHELL', "Tier 1: App Shell Pre-cache Array"),
        ('.woff2', "Tier 1: Typography Woff2 Matcher"),
        ('tailwindcss', "Tier 1: Tailwind CSS Matcher"),
        ('font-awesome', "Tier 1: FontAwesome Matcher"),

        # Tier 2: Stale-While-Revalidate SKU Catalog Cache
        ('CATALOG_CACHE_NAME', "Tier 2: Catalog Cache Namespace"),
        ('products_catalog.json', "Tier 2: Products Catalog JSON Matcher"),
        ('rani_products.json', "Tier 2: Rani Products JSON Matcher"),
        ('openfoodfacts.org', "Tier 2: OpenFoodFacts Image Cache"),
        ('unsplash.com', "Tier 2: Unsplash Image Cache"),

        # Tier 3: Network-First with Background Queue
        ('/api/orders', "Tier 3: Orders API Interception"),
        ('/api/pos/orders', "Tier 3: POS Orders API Interception"),
        ('handleOfflineOrderEnqueue', "Tier 3: Offline Enqueue Handler"),
        ('saveOfflineOrderToIDB', "Tier 3: IndexedDB Offline Order Storage"),
        ('syncPendingOfflineOrders', "Tier 3: Background Order Draining Sync"),
        ('sync-offline-orders', "Tier 3: SyncManager Tag Registration"),
        ('addEventListener(\'sync\'', "Tier 3: SyncManager Event Listener")
    ]

    all_ok = True
    for needle, label in checks:
        present = needle in sw_code
        print(f"  [{'PASS' if present else 'FAIL'}] {label}")
        if not present:
            all_ok = False

    assert all_ok, "sw.js is missing required caching tier structures!"

def test_audio_chime_asset():
    print("\n--- 2. Verifying Audio Chime Asset ---")
    assert os.path.exists('audio/chime.mp3'), "audio/chime.mp3 missing!"
    assert os.path.exists('public/audio/chime.mp3'), "public/audio/chime.mp3 missing!"
    size = os.path.getsize('audio/chime.mp3')
    print(f"  [PASS] audio/chime.mp3 exists ({size} bytes)")
    assert size > 1000, "audio/chime.mp3 is suspiciously small"

def test_store_html_offline_integration():
    print("\n--- 3. Verifying store.html Offline UI Elements & Error Modal Prevention ---")
    with open('store.html', 'r', encoding='utf-8') as f:
        html = f.read()

    checks = [
        ('id="pwa-offline-banner"', "PWA Offline Status Banner"),
        ('id="pwa-online-toast"', "PWA Online Reconnection Toast"),
        ('id="bill-offline-status-banner"', "Invoice Offline Order Status Banner"),
        ('id="bill-offline-inv-id"', "Invoice Offline Order ID Display"),
        ('/audio/chime.mp3', "Audio Chime Playback Hook"),
        ('store_upgrade_module.js', "Store Upgrade Module Script"),
        ('RaniOfflineOrderQueue', "Client-Side Offline Order Queue"),
        ('playAudioChime', "Audio Chime Trigger Function")
    ]

    all_ok = True
    for needle, label in checks:
        present = needle in html or ('store_upgrade_module.js' in html and needle in open('store_upgrade_module.js', encoding='utf-8').read())
        print(f"  [{'PASS' if present else 'FAIL'}] {label}")
        if not present:
            all_ok = False

    assert all_ok, "store.html is missing offline UI components!"

def test_airplane_mode_simulation():
    print("\n--- 4. Simulating Airplane Mode Checkout & Background Sync (Node.js) ---")
    node_test = """
    const fs = require('fs');

    // Mock IndexedDB
    const fakeIDB = new Map();
    global.self = {
        indexedDB: {
            open: function(dbName, version) {
                const req = { onsuccess: null, onerror: null, onupgradeneeded: null };
                setTimeout(() => {
                    req.result = {
                        objectStoreNames: { contains: () => true },
                        transaction: function() {
                            return {
                                objectStore: function() {
                                    return {
                                        put: function(item) {
                                            fakeIDB.set(item.id, item);
                                            const r = { onsuccess: null, onerror: null };
                                            setTimeout(() => { if (r.onsuccess) r.onsuccess(); }, 2);
                                            return r;
                                        },
                                        getAll: function() {
                                            const r = { onsuccess: null, onerror: null, result: Array.from(fakeIDB.values()) };
                                            setTimeout(() => { if (r.onsuccess) r.onsuccess(); }, 2);
                                            return r;
                                        },
                                        delete: function(id) {
                                            fakeIDB.delete(id);
                                            const r = { onsuccess: null, onerror: null };
                                            setTimeout(() => { if (r.onsuccess) r.onsuccess(); }, 2);
                                            return r;
                                        }
                                    };
                                }
                            };
                        }
                    };
                    if (req.onsuccess) req.onsuccess({ target: req });
                }, 2);
                return req;
            }
        },
        registration: {
            sync: {
                register: async (tag) => {
                    console.log(`  [Mock SyncManager] Registered sync event tag: "${tag}"`);
                    return true;
                }
            }
        },
        clients: {
            matchAll: async () => [{ postMessage: (msg) => console.log('  [Mock Client PostMessage]:', msg.type) }],
            claim: async () => {}
        },
        skipWaiting: () => {},
        addEventListener: () => {}
    };

    // Load sw.js functions
    const swCode = fs.readFileSync('sw.js', 'utf8');
    eval(swCode);

    // Mock an offline order submission during Airplane Mode
    async function runAirplaneModeCheckout() {
        console.log('✈️  Simulating Customer / Cashier placing order in Airplane Mode...');
        const mockOrderPayload = {
            id: 'OFFLINE-TEST-ORD-01',
            invId: '#RHM-INV-998877',
            customerName: 'Karthik Raja',
            customerPhone: '98421 12345',
            items: [
                { id: '101', title: '1KG R PONNI PACHAARISI', price: 68, quantity: 2, mrp: 75 },
                { id: '202', title: '1Kg Pasi Paruppu (R)', price: 125, quantity: 1, mrp: 140 }
            ],
            totalAmount: 261,
            paymentMethod: 'Cash on Delivery (Doorstep)',
            date: '23/11/2026',
            time: '05:35 AM'
        };

        const mockReq = {
            json: async () => mockOrderPayload
        };

        // Call handleOfflineOrderEnqueue
        const response = await handleOfflineOrderEnqueue(mockReq);
        const resText = await response.text();
        const resJson = JSON.parse(resText);

        console.log('  Response Status Code:', response.status);
        console.log('  Response Body:', resJson);

        if (response.status !== 200 || !resJson.success || !resJson.offline) {
            console.error('FAIL: Offline order did not return HTTP 200 synthetic response!');
            process.exit(1);
        }

        // Verify it was stored in IndexedDB
        console.log(`  IndexedDB queue count: ${fakeIDB.size} order(s)`);
        if (fakeIDB.size !== 1) {
            console.error('FAIL: Order was not written to IndexedDB queue!');
            process.exit(1);
        }

        const queued = fakeIDB.get('OFFLINE-TEST-ORD-01');
        console.log('  Queued Order Verified in IDB:', queued.invId, queued.customerName, '₹' + queued.totalAmount);

        // Simulate connection recovery: drain queue
        console.log('\\n🌐 Simulating Network Recovery: Background Sync draining queue...');
        // Mock global fetch for background sync
        global.fetch = async (url, options) => {
            console.log(`  [Mock Fetch] POST ${url} - Transmitting offline order: ${JSON.parse(options.body).invId}`);
            return {
                ok: true,
                status: 200,
                json: async () => ({ success: true, synced: true })
            };
        };

        await syncPendingOfflineOrders();
        console.log(`  IndexedDB queue count after sync: ${fakeIDB.size} order(s)`);
        if (fakeIDB.size !== 0) {
            console.error('FAIL: IndexedDB queue was not purged after sync!');
            process.exit(1);
        }

        console.log('✅ AIRPLANE MODE CHECKOUT & RECOVERY SYNC 100% SUCCESSFUL!');
    }

    (async () => {
        try {
            await runAirplaneModeCheckout();
            process.exit(0);
        } catch (err) {
            console.error('Execution error:', err);
            process.exit(1);
        }
    })();
    """

    res = subprocess.run(["node", "-e", node_test], capture_output=True, text=True)
    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    assert res.returncode == 0, "Airplane mode simulation failed!"

if __name__ == '__main__':
    print("==================================================================")
    print("  RANI HYPER MARKET: WORKBOX PWA OFFLINE CHECKOUT VERIFICATION")
    print("==================================================================")
    test_sw_script_structure()
    test_audio_chime_asset()
    test_store_html_offline_integration()
    test_airplane_mode_simulation()
    print("\nALL OFFLINE CHECKOUT ARCHITECTURE CHECKS PASSED 100% PERFECTLY!\n")
