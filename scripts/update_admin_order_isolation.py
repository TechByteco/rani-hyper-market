#!/usr/bin/env python3
"""
update_admin_order_isolation.py
Updates admin.html, public/admin.html, and pre_model/admin.html:
1. Strictly isolates online store orders from offline SNS Market desktop software data.
2. Directs offline POS bills (24,901) into offlineCounterBills, rendering them in Counter Dispatches and Bill History.
3. Directs online storefront purchases (from /api/orders and store.html) into allOrders, rendering them in the Online Orders table.
4. Corrects count pills (cnt-all, cnt-pending, etc.) to count only online store orders.
"""

import os
import sys
import re

def update_admin(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update HTML heading in module-sec-orders
    old_heading = """            <h2 class="text-lg font-black text-gray-900 flex items-center gap-2">
              <i class="fa-solid fa-receipt text-blue-600"></i> Recent Orders &amp; Live Counter Dispatch
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">Quick status management for recent counter &amp; delivery orders. For full accounting archive, use dedicated Bill History.</p>"""

    new_heading = """            <h2 class="text-lg font-black text-gray-900 flex items-center gap-2">
              <i class="fa-solid fa-cart-shopping text-blue-600"></i> Live Online Store Orders (Phone &amp; Web Only)
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">Showing strictly customer orders placed through the online storefront. Offline SNS Market software counter bills are managed separately in Counter Dispatches &amp; Bill History below.</p>"""

    if old_heading in content:
        content = content.replace(old_heading, new_heading)
        print("  Updated online orders section heading")

    # 2. Add offlineCounterBills global variable declaration
    old_globals = """let allProducts = [];
    let allOrders = [];
    let customerCrmList = [];"""

    new_globals = """let allProducts = [];
    let allOrders = []; // Strictly online store orders
    let offlineCounterBills = []; // Strictly offline counter POS bills from SNS Market software
    let customerCrmList = [];"""

    if old_globals in content:
        content = content.replace(old_globals, new_globals)
        print("  Added offlineCounterBills global variable")

    # 3. Add isStrictOnlineStoreOrder validator function
    validator_code = """    // Strict Online Store Order Validator (Excludes all offline SNS Market software bills)
    function isStrictOnlineStoreOrder(o) {
      if (!o) return false;
      const id = String(o.id || '').toUpperCase();
      const inv = String(o.invId || o.voucher_no || '').toUpperCase();
      // Exclude mock demo orders
      if (id.startsWith('ORD-RHMTODAY') || id.startsWith('ORD-RHMYEST') || id.startsWith('ORD-RHM-YEST') || id.startsWith('ORD-RHM2DAYS') || id.startsWith('ORD-RHM3DAYS')) return false;
      if (inv.includes('982101') || inv.includes('982102') || inv.includes('982103') || inv.includes('982104') || inv.includes('981902') || inv.includes('981701') || inv.includes('981601')) return false;
      // Exclude offline POS counter bills from SNS Market software
      if (o.source === 'Offline POS' || o.source === 'Desktop App' || o.is_offline_bill) return false;
      if (id.startsWith('RANI-') && !o.items && !o.timeslot && !o.shipping_address) return false;
      return true;
    }"""

    if "function isStrictOnlineStoreOrder" not in content:
        content = content.replace("    function renderOrdersListTable() {", validator_code + "\n\n    function renderOrdersListTable() {")
        print("  Added isStrictOnlineStoreOrder validator")

    # 4. Separate orders loading in initDashboard
    old_orders_init = """        // 3. Orders: Prioritize live orders directly from SQLite database
        let localOrders = (liveOrdersRes && liveOrdersRes.length > 0) ? liveOrdersRes : (ordersRes || []);

        // Merge real-time Supabase web store orders
        try {
          const { data: sbOrders } = await sb.from('orders').select('*').order('created_at', { ascending: false });
          if (sbOrders && sbOrders.length > 0) {
            const existingIds = new Set(localOrders.map(o => String(o.id)));
            sbOrders.forEach(o => {
              if (!existingIds.has(String(o.id))) localOrders.unshift(o);
            });
          }
        } catch(e) {}

        // Merge local counter POS orders if any
        try {
          const posOrders = JSON.parse(localStorage.getItem('nsn_pos_orders') || '[]');
          if (posOrders && posOrders.length > 0) {
            const existingIds = new Set(localOrders.map(o => String(o.id)));
            posOrders.forEach(o => {
              if (!existingIds.has(String(o.id))) localOrders.unshift(o);
            });
          }
        } catch(e) {}

        if (localOrders.length > 0) {
          allOrders = localOrders;
          
          const totalCount = posStatusRes && posStatusRes.liveStats ? posStatusRes.liveStats.totalBills : (raniAnalytics ? raniAnalytics.totalOrders : allOrders.length);
          const counts = {
            all: totalCount,
            pending: allOrders.filter(o => o.status === 'pending').length,
            processing: allOrders.filter(o => o.status === 'processing').length,
            delivered: totalCount,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length
          };

          if (document.getElementById('cnt-all')) document.getElementById('cnt-all').innerText = counts.all.toLocaleString('en-IN');
          if (document.getElementById('cnt-pending')) document.getElementById('cnt-pending').innerText = counts.pending.toLocaleString('en-IN');
          if (document.getElementById('cnt-processing')) document.getElementById('cnt-processing').innerText = counts.processing.toLocaleString('en-IN');
          if (document.getElementById('cnt-delivered')) document.getElementById('cnt-delivered').innerText = counts.delivered.toLocaleString('en-IN');
          if (document.getElementById('cnt-cancelled')) document.getElementById('cnt-cancelled').innerText = counts.cancelled.toLocaleString('en-IN');

          renderOrdersListTable();
          renderJournalLedger();
          renderLiveCounterDispatches();
          updatePaymentBreakdown();
          updateTopSellersLeaderboard();
        }"""

    new_orders_init = """        // 3. SEPARATE OFFLINE COUNTER POS BILLS VS ONLINE STORE ORDERS
        // A. Offline POS Bills from SNS Market Desktop Software
        offlineCounterBills = (liveOrdersRes && liveOrdersRes.length > 0) ? liveOrdersRes : (ordersRes || []);

        // B. Online Store Orders (Strictly from Storefront / Phone checkouts)
        let rawOnlineOrders = [];
        try {
          const onlineBackendRes = await fetch('/api/orders?status=all').then(r => r.json()).catch(() => null);
          if (onlineBackendRes && onlineBackendRes.success && Array.isArray(onlineBackendRes.orders)) {
            rawOnlineOrders.push(...onlineBackendRes.orders);
          }
        } catch(e) {}

        try {
          const localStored = JSON.parse(localStorage.getItem('nsn_orders') || '[]');
          if (Array.isArray(localStored) && localStored.length > 0) {
            rawOnlineOrders.push(...localStored);
          }
        } catch(e) {}

        // Merge real-time Supabase web store orders (strictly online)
        try {
          const { data: sbOrders } = await sb.from('orders').select('*').order('created_at', { ascending: false });
          if (sbOrders && sbOrders.length > 0) {
            sbOrders.forEach(o => {
              if (isStrictOnlineStoreOrder(o)) rawOnlineOrders.push(o);
            });
          }
        } catch(e) {}

        // Strictly filter to ensure zero offline POS bills leak into online orders table
        const seenOnlineIds = new Set();
        allOrders = [];
        rawOnlineOrders.forEach(o => {
          if (!o || !isStrictOnlineStoreOrder(o)) return;
          const key = String(o.id || o.invId || o.voucher_no || '');
          if (!seenOnlineIds.has(key)) {
            seenOnlineIds.add(key);
            allOrders.push(o);
          }
        });

        // Update Online Store Orders count pills (counts ONLY online orders)
        updateOnlineOrdersCountPills();

        renderOrdersListTable();
        renderJournalLedger();
        renderLiveCounterDispatches();
        updatePaymentBreakdown();
        updateTopSellersLeaderboard();"""

    if old_orders_init in content:
        content = content.replace(old_orders_init, new_orders_init)
        print("  Updated initDashboard order loading logic")

    # 5. Add updateOnlineOrdersCountPills function and update renderOrdersListTable empty state
    old_empty_table = """      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-gray-400">No orders found matching current filter/date.</td></tr>';
        return;
      }"""

    new_empty_table = """      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-12 text-center text-gray-400">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 text-xl shadow-xs">
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
              <p class="text-sm font-bold text-gray-800">No Online Store Orders Yet &bull; Clean Slate</p>
              <p class="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Showing strictly customer purchases placed through the online storefront. Offline SNS Market software counter bills (24,901) are archived in Counter Dispatches and Bill History below.
              </p>
            </td>
          </tr>
        `;
        return;
      }"""

    if old_empty_table in content:
        content = content.replace(old_empty_table, new_empty_table)
        print("  Updated renderOrdersListTable empty state")

    # 6. Add updateOnlineOrdersCountPills implementation
    pills_func = """    function updateOnlineOrdersCountPills() {
      const counts = {
        all: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending' || o.status === 'new').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        out_for_delivery: allOrders.filter(o => o.status === 'out_for_delivery').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length
      };

      if (document.getElementById('cnt-all')) document.getElementById('cnt-all').innerText = counts.all.toLocaleString('en-IN');
      if (document.getElementById('cnt-pending')) document.getElementById('cnt-pending').innerText = counts.pending.toLocaleString('en-IN');
      if (document.getElementById('cnt-processing')) document.getElementById('cnt-processing').innerText = counts.processing.toLocaleString('en-IN');
      if (document.getElementById('cnt-delivered')) document.getElementById('cnt-delivered').innerText = counts.delivered.toLocaleString('en-IN');
      if (document.getElementById('cnt-cancelled')) document.getElementById('cnt-cancelled').innerText = counts.cancelled.toLocaleString('en-IN');
    }"""

    if "function updateOnlineOrdersCountPills" not in content:
        content = content.replace("    function renderOrdersListTable() {", pills_func + "\n\n    function renderOrdersListTable() {")
        print("  Added updateOnlineOrdersCountPills function")

    # 7. Update renderLiveCounterDispatches to use offlineCounterBills
    old_disp_check = """      if (!allOrders || allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-gray-400">No recent orders recorded yet.</td></tr>';
        return;
      }

      // Compute Live Today Counter Metrics from latest recorded date
      const latestDateStr = (allOrders[0]?.voucher_date) || (allOrders[0]?.created_at ? new Date(allOrders[0].created_at).toISOString().slice(0,10) : '2026-10-21');
      const targetDateStr = selectedSpecificDate || latestDateStr;
      const todayOrders = allOrders.filter(o => {
        const d = o.voucher_date || (o.created_at ? new Date(o.created_at).toISOString().slice(0,10) : '');
        return d === targetDateStr;
      });

      const todayCounterCount = todayOrders.length > 0 ? todayOrders.length : 45;
      const todayCounterSales = todayOrders.length > 0 ? todayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) : 7674;

      const countEl = document.getElementById('counter-today-count');
      const salesEl = document.getElementById('counter-today-sales');
      if (countEl) countEl.innerText = todayCounterCount + ' bills (Live Today: ' + targetDateStr + ')';
      if (salesEl) salesEl.innerText = '₹' + todayCounterSales.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      // Filter orders for the table
      let list = allOrders;"""

    new_disp_check = """      const dataSource = (offlineCounterBills && offlineCounterBills.length > 0) ? offlineCounterBills : allOrders;
      if (!dataSource || dataSource.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-gray-400">No recent counter dispatches recorded yet.</td></tr>';
        return;
      }

      // Compute Live Today Counter Metrics from latest recorded date
      const latestDateStr = (dataSource[0]?.voucher_date) || (dataSource[0]?.created_at ? new Date(dataSource[0].created_at).toISOString().slice(0,10) : '2026-11-21');
      const targetDateStr = selectedSpecificDate || latestDateStr;
      const todayOrders = dataSource.filter(o => {
        const d = o.voucher_date || (o.created_at ? new Date(o.created_at).toISOString().slice(0,10) : '');
        return d === targetDateStr;
      });

      const todayCounterCount = todayOrders.length > 0 ? todayOrders.length : 45;
      const todayCounterSales = todayOrders.length > 0 ? todayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) : 7674;

      const countEl = document.getElementById('counter-today-count');
      const salesEl = document.getElementById('counter-today-sales');
      if (countEl) countEl.innerText = todayCounterCount + ' bills (Live Today: ' + targetDateStr + ')';
      if (salesEl) salesEl.innerText = '₹' + todayCounterSales.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      // Filter counter orders for the table
      let list = dataSource;"""

    if old_disp_check in content:
        content = content.replace(old_disp_check, new_disp_check)
        print("  Updated renderLiveCounterDispatches to use offlineCounterBills")

    # 8. Update pollLiveOnlineOrders to maintain strict isolation
    old_poll = """        if (res && res.success && Array.isArray(res.orders)) {
          let hasNewOrders = false;
          res.orders.forEach(ro => {
            const orderId = ro.id || ro.invId;"""

    new_poll = """        if (res && res.success && Array.isArray(res.orders)) {
          let hasNewOrders = false;
          res.orders.forEach(ro => {
            if (!isStrictOnlineStoreOrder(ro)) return;
            const orderId = ro.id || ro.invId;"""

    if old_poll in content:
        content = content.replace(old_poll, new_poll)
        print("  Updated pollLiveOnlineOrders with strict online check")

    # 9. Update renderOrdersListTable to refresh count pills
    old_render_end = """      tbody.innerHTML = rowsHtml;
    }"""

    new_render_end = """      tbody.innerHTML = rowsHtml;
      updateOnlineOrdersCountPills();
    }"""

    if old_render_end in content:
        content = content.replace(old_render_end, new_render_end)
        print("  Connected updateOnlineOrdersCountPills into renderOrdersListTable")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished {filepath}\n")

if __name__ == '__main__':
    for p in ['admin.html', 'public/admin.html', 'pre_model/admin.html']:
        if os.path.exists(p):
            update_admin(p)
