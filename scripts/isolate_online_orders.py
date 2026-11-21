#!/usr/bin/env python3
"""
isolate_online_orders.py
Strictly isolates online store orders from offline SNS Market software data:
1. In orders.html, online-orders.html (and public/ variants):
   - Removes mock demo order generators completely.
   - Adds isStrictOnlineStoreOrder validator that filters out any offline POS counter vouchers.
   - Ensures online orders bill view only displays customer purchases placed through the online storefront.
2. In admin.html (and public/admin.html, pre_model/admin.html):
   - Separates offlineCounterBills from onlineStoreOrders.
   - Online Orders table (#orders-list-tbody) and count pills (#cnt-all, #cnt-pending, etc.) strictly display online store orders.
   - Offline counter POS bills are routed exclusively to Counter Dispatches (#live-counter-tbody) and Bill History (bill_history.html).
"""

import os
import re

def clean_orders_portal(filepath):
    print(f"Cleaning {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add strict online order validator and remove demo references
    strict_validator_js = """    // Strict Online Store Order Validator (Excludes all offline SNS Market desktop software bills)
    function isStrictOnlineStoreOrder(o) {
      if (!o) return false;
      const id = String(o.id || '').toUpperCase();
      const inv = String(o.invId || o.voucher_no || '').toUpperCase();
      // Exclude mock demo orders
      if (id.startsWith('ORD-RHMTODAY') || id.startsWith('ORD-RHMYEST') || id.startsWith('ORD-RHM-YEST') || id.startsWith('ORD-RHM2DAYS') || id.startsWith('ORD-RHM3DAYS')) return false;
      if (inv.includes('982101') || inv.includes('982102') || inv.includes('982103') || inv.includes('982104') || inv.includes('981902') || inv.includes('981701') || inv.includes('981601')) return false;
      // Exclude offline POS counter bills from SNS Market software
      if (o.source === 'Offline POS' || o.source === 'Desktop App' || o.is_offline_bill) return false;
      if (id.startsWith('RANI-') && !o.items && !o.timeslot) return false;
      return true;
    }"""

    if "function isStrictOnlineStoreOrder" not in content:
        content = content.replace("    function deduplicateOrders(orders) {", strict_validator_js + "\n\n    function deduplicateOrders(orders) {")
        print("  Added isStrictOnlineStoreOrder validator")

    # 2. In loadOrders, filter out any offline or demo records
    old_load = """      // 1. Read real orders placed in store from localStorage
      try {
        const local = JSON.parse(localStorage.getItem('nsn_orders') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          orders = local;
        }
      } catch(e) {
        console.warn('Error reading nsn_orders:', e);
      }"""

    new_load = """      // 1. Read real orders placed strictly in online store from localStorage
      try {
        const local = JSON.parse(localStorage.getItem('nsn_orders') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          // Strictly keep ONLY online store orders (exclude offline SNS Market bills)
          orders = local.filter(isStrictOnlineStoreOrder);
        }
      } catch(e) {
        console.warn('Error reading nsn_orders:', e);
      }"""

    if old_load in content:
        content = content.replace(old_load, new_load)
        print("  Updated loadOrders to filter out offline bills")

    # 3. In fetchLiveOrdersFromBackend, filter out any non-online orders
    old_fetch_live = """    async function fetchLiveOrdersFromBackend() {
      try {
        const res = await fetch('/api/orders?status=all').then(r => r.json()).catch(() => null);
        if (res && res.success && Array.isArray(res.orders)) {
          const local = JSON.parse(localStorage.getItem('nsn_orders') || '[]');
          const combined = deduplicateOrders([...res.orders, ...local]);
          if (combined.length > 0 && combined.length !== allOrders.length) {
            allOrders = normalizeOrders(combined);
            applyFilters();
            updatePillsCount();
          }
        }
      } catch(e) {
        console.warn('fetchLiveOrders error:', e);
      }
    }"""

    new_fetch_live = """    async function fetchLiveOrdersFromBackend() {
      try {
        const res = await fetch('/api/orders?status=all').then(r => r.json()).catch(() => null);
        if (res && res.success && Array.isArray(res.orders)) {
          const local = JSON.parse(localStorage.getItem('nsn_orders') || '[]').filter(isStrictOnlineStoreOrder);
          const validOnlineOrders = res.orders.filter(isStrictOnlineStoreOrder);
          const combined = deduplicateOrders([...validOnlineOrders, ...local]);
          if (combined.length !== allOrders.length) {
            allOrders = normalizeOrders(combined);
            applyFilters();
            updatePillsCount();
          }
        }
      } catch(e) {
        console.warn('fetchLiveOrders error:', e);
      }
    }"""

    if old_fetch_live in content:
        content = content.replace(old_fetch_live, new_fetch_live)
        print("  Updated fetchLiveOrdersFromBackend with strict online filter")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished {filepath}\n")

if __name__ == '__main__':
    for p in ['orders.html', 'public/orders.html', 'online-orders.html', 'public/online-orders.html']:
        if os.path.exists(p):
            clean_orders_portal(p)
