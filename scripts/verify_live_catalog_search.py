"""
Live Production Verification: PWA Catalog Search Optimization
Target: https://rani-hyper-market.vercel.app/store and https://rani-hyper-market.vercel.app/catalog-search.worker.js
"""

import urllib.request
import json
import time

def verify_live_store():
    url = "https://rani-hyper-market.vercel.app/store"
    print(f"Fetching live store page: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        status = res.status
        html = res.read().decode('utf-8')

    print(f"  HTTP Status: {status}")
    assert status == 200, f"Expected status 200, got {status}"

    checks = [
        ('id="search-perf-bar"', "Search Performance Bar"),
        ('id="perf-worker-status"', "Worker Engine Status"),
        ('id="perf-search-time"', "Search Latency Pill (<25ms)"),
        ('id="perf-dom-count"', "Active DOM Counter (<40 cards)"),
        ('id="virtual-grid-container"', "Virtual Grid Container"),
        ('id="virtual-grid-spacer"', "Virtual Grid Spacer"),
        ('RaniVirtualScroller', "RaniVirtualScroller Engine"),
        ('initCatalogSearchWorker', "Catalog Search Worker Client"),
        ('handleLiveSearch', "Live Search Handler"),
        ('🌾 அரிசி (Rice)', "Quick Search Pill: Rice"),
        ('🥣 பருப்பு (Dal)', "Quick Search Pill: Dal"),
        ('🌻 எண்ணெய் (Oil)', "Quick Search Pill: Oil")
    ]

    all_passed = True
    for needle, label in checks:
        passed = needle in html
        print(f"  [{'PASS' if passed else 'FAIL'}] {label} present on live store")
        if not passed:
            all_passed = False

    assert all_passed, "Live store missing required virtual search components!"

def verify_live_worker():
    url = "https://rani-hyper-market.vercel.app/catalog-search.worker.js"
    print(f"\nFetching live Web Worker: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        status = res.status
        content = res.read().decode('utf-8')

    print(f"  HTTP Status: {status}")
    assert status == 200, f"Expected status 200, got {status}"

    checks = [
        ('BILINGUAL_CLUSTERS', "Bilingual Synonym Map"),
        ('isLevenshteinOne', "Levenshtein Distance Engine (d=1)"),
        ('CatalogSearchIndex', "Inverted Index Engine"),
        ('INIT_INDEX', "Message: INIT_INDEX"),
        ('SEARCH', "Message: SEARCH")
    ]

    all_passed = True
    for needle, label in checks:
        passed = needle in content
        print(f"  [{'PASS' if passed else 'FAIL'}] {label} present in live worker")
        if not passed:
            all_passed = False

    assert all_passed, "Live worker missing required engine logic!"

if __name__ == '__main__':
    print("==================================================================")
    print("  RANI HYPER MARKET: LIVE VERCEL SEARCH VERIFICATION")
    print("==================================================================")
    verify_live_store()
    verify_live_worker()
    print("\nALL LIVE PRODUCTION VERIFICATIONS PASSED 100% PERFECTLY!\n")
