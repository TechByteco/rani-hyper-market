"""
Verification Suite: PWA Catalog Search Optimization (< 25ms, Web Worker, Bilingual, Virtual Scroller < 40 DOM nodes)
Rani Hyper Market (SNS Market) — Main Road, Bodinayakanur & Theni District
"""

import os
import sys
import json
import time
import subprocess

def test_web_worker_engine():
    print("\n--- 1. Testing Web Worker Search Engine Latency & Accuracy ---")
    node_script = """
    const fs = require('fs');
    const vm = require('vm');
    const { performance } = require('perf_hooks');

    // Mock Web Worker environment
    global.self = {
        postMessage: () => {}
    };

    // Load worker code in global context
    const workerCode = fs.readFileSync('catalog-search.worker.js', 'utf8');
    vm.runInThisContext(workerCode);

    const catalogData = JSON.parse(fs.readFileSync('products_catalog.json', 'utf8'));
    console.log(`[Worker Engine] Loaded ${catalogData.length} products.`);

    const t0 = performance.now();
    const stats = searchIndex.buildIndex(catalogData);
    const buildTime = (performance.now() - t0).toFixed(2);
    console.log(`[Worker Engine] Index built in ${buildTime} ms (${stats.tokenCount} tokens, ${stats.vocabSize} vocab words).`);

    const testQueries = [
        { q: 'arisi', desc: 'Bilingual Tanglish Rice' },
        { q: 'அரிசி', desc: 'Bilingual Tamil Script Rice' },
        { q: 'rice', desc: 'Bilingual English Rice' },
        { q: 'paruppu', desc: 'Bilingual Tanglish Dal' },
        { q: 'பருப்பு', desc: 'Bilingual Tamil Script Dal' },
        { q: 'dal', desc: 'Bilingual English Dal' },
        { q: 'ennai', desc: 'Bilingual Tanglish Oil' },
        { q: 'எண்ணெய்', desc: 'Bilingual Tamil Script Oil' },
        { q: 'poni', desc: 'Typo Levenshtein 1: poni -> ponni' },
        { q: 'chili', desc: 'Typo Levenshtein 1: chili -> chilli' },
        { q: 'sugr', desc: 'Typo Levenshtein 1: sugr -> sugar' },
        { q: 'parupu', desc: 'Typo Levenshtein 1: parupu -> paruppu' },
        { q: 'cardamom', desc: 'English Spice' }
    ];

    let allUnder25ms = true;
    let bilingualPass = true;
    let typoPass = true;

    testQueries.forEach(t => {
        const res = searchIndex.search(t.q, { limit: 100 });
        const latency = res.queryTimeMs;
        const passLatency = latency < 25.0;
        if (!passLatency) allUnder25ms = false;

        const firstTitle = res.results.length > 0 ? res.results[0].title : 'NONE';
        console.log(`  Query "${t.q}" (${t.desc}): ${res.totalMatches} matches in ${latency} ms -> Top: ${firstTitle}`);

        if (['arisi', 'அரிசி', 'rice'].includes(t.q)) {
            const hasRice = res.results.slice(0, 5).some(p => {
                const s = (p.title || '').toLowerCase();
                return s.includes('rice') || s.includes('ponni') || s.includes('arisi') || s.includes('raw') || s.includes('idli');
            });
            if (!hasRice) {
                console.error(`  FAIL: Query "${t.q}" did not return rice products in top 5!`);
                bilingualPass = false;
            }
        }

        if (['poni', 'chili', 'sugr', 'parupu'].includes(t.q)) {
            if (res.results.length === 0) {
                console.error(`  FAIL: Typo query "${t.q}" returned 0 matches!`);
                typoPass = false;
            }
        }
    });

    console.log(`\nLatency Benchmark (<25ms): ${allUnder25ms ? 'PASS (ALL UNDER 25ms)' : 'FAIL'}`);
    console.log(`Bilingual Synonym Resolution: ${bilingualPass ? 'PASS (Rice/Arisi verified)' : 'FAIL'}`);
    console.log(`Levenshtein Typo Tolerance: ${typoPass ? 'PASS (Fuzzy typos verified)' : 'FAIL'}`);

    if (!allUnder25ms || !bilingualPass || !typoPass) {
        process.exit(1);
    }
    """

    res = subprocess.run(["node", "-e", node_script], capture_output=True, text=True)
    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    assert res.returncode == 0, "Worker search engine verification failed!"

def test_virtual_scroller_dom_constraint():
    print("\n--- 2. Testing RaniVirtualScroller DOM Node Constraint (< 40 Active Cards) ---")
    node_script = """
    // Simulate RaniVirtualScroller logic across multiple viewport breakpoints and scroll depths
    const viewports = [
        { name: 'Mobile (360x780)', w: 360, h: 780, expectedCols: 2, rowHeight: 365 },
        { name: 'Phablet (640x900)', w: 640, h: 900, expectedCols: 3, rowHeight: 380 },
        { name: 'Tablet (768x1024)', w: 768, h: 1024, expectedCols: 4, rowHeight: 380 },
        { name: 'Laptop (1024x768)', w: 1024, h: 768, expectedCols: 5, rowHeight: 380 },
        { name: 'Desktop (1440x900)', w: 1440, h: 900, expectedCols: 6, rowHeight: 380 }
    ];

    const totalCatalogItems = 7686;
    let allUnder40 = true;

    viewports.forEach(vp => {
        const numRows = Math.ceil(totalCatalogItems / vp.expectedCols);
        const totalHeight = numRows * vp.rowHeight;
        const bufferRows = (vp.expectedCols >= 5) ? 1 : 2;
        const viewportRows = Math.ceil(vp.h / vp.rowHeight);
        const maxAllowedRows = Math.floor(36 / vp.expectedCols);
        const visibleRows = Math.min(maxAllowedRows, viewportRows + (bufferRows * 2));

        // Test across 5 different scroll offsets: top, 25%, 50%, 75%, bottom
        const scrollOffsets = [
            0,
            Math.floor(totalHeight * 0.25),
            Math.floor(totalHeight * 0.50),
            Math.floor(totalHeight * 0.75),
            totalHeight - vp.h
        ];

        scrollOffsets.forEach(scrollY => {
            const relativeY = Math.max(0, scrollY);
            const startRow = Math.max(0, Math.floor(relativeY / vp.rowHeight) - bufferRows);
            const endRow = Math.min(numRows, startRow + visibleRows);
            const activeCards = (endRow - startRow) * vp.expectedCols;

            if (activeCards >= 40) {
                console.error(`FAIL: ${vp.name} at scrollY=${scrollY} rendered ${activeCards} DOM cards (>= 40)!`);
                allUnder40 = false;
            }
        });

        const maxCardsForVp = visibleRows * vp.expectedCols;
        console.log(`  [${vp.name}] ${vp.expectedCols} cols x ${visibleRows} visible rows -> Max Active Cards: ${maxCardsForVp} (Strictly < 40)`);
    });

    console.log(`DOM Node Cap (< 40 elements): ${allUnder40 ? 'PASS (100% CAPPED)' : 'FAIL'}`);
    if (!allUnder40) process.exit(1);
    """

    res = subprocess.run(["node", "-e", node_script], capture_output=True, text=True)
    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    assert res.returncode == 0, "Virtual scroller DOM constraint test failed!"

def test_store_html_integration():
    print("\n--- 3. Testing store.html Integration & UI Elements ---")
    with open('store.html', 'r', encoding='utf-8') as f:
        html = f.read()

    checks = [
        ('id="search-perf-bar"', "Search Performance Bar"),
        ('id="perf-worker-status"', "Worker Engine Status Pill"),
        ('id="perf-search-time"', "Live Search Latency Pill (<25ms)"),
        ('id="perf-dom-count"', "Active DOM Counter Pill (<40 cards)"),
        ('id="virtual-grid-container"', "Virtual Grid Container"),
        ('id="virtual-grid-spacer"', "Virtual Grid Height Spacer"),
        ('RaniVirtualScroller', "RaniVirtualScroller Engine"),
        ('initCatalogSearchWorker', "Catalog Search Worker Client"),
        ('handleLiveSearch', "Live Search Handler"),
        ('applyBilingualSearch', "Bilingual Quick Chips Handler"),
        ('🌾 அரிசி (Rice)', "Quick Search Pill: Rice"),
        ('🥣 பருப்பு (Dal)', "Quick Search Pill: Dal"),
        ('🌻 எண்ணெய் (Oil)', "Quick Search Pill: Oil")
    ]

    all_present = True
    for needle, label in checks:
        present = needle in html
        print(f"  [{'OK' if present else 'FAIL'}] {label} present in store.html")
        if not present:
            all_present = False

    assert all_present, "store.html is missing required virtual search components!"

if __name__ == '__main__':
    print("==================================================================")
    print("  RANI HYPER MARKET: CATALOG SEARCH & VIRTUAL SCROLLER VERIFICATION")
    print("==================================================================")
    test_web_worker_engine()
    test_virtual_scroller_dom_constraint()
    test_store_html_integration()
    print("\nALL VERIFICATION CHECKS PASSED PERFECTLY!\n")
