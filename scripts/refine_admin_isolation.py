import os
import sys

def refine_admin(filepath):
    print(f"Refining {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update loadOrders
    target_load_orders = """    /* ORDERS MANAGEMENT */
    async function loadOrders() {
      let orders = null;
      try {
        const res = await sb.from('orders').select('*').order('created_at', { ascending: false });
        if (res && res.data && res.data.length > 0) orders = res.data;
      } catch (e) {}

      if (!orders || orders.length === 0) {
        try {
          const resp = await fetch('rani_orders.json');
          if (resp.ok) orders = await resp.json();
        } catch (e) {}
      }

      if (!orders || orders.length === 0) return;

      allOrders = orders;
      
      const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      };

      if (document.getElementById('cnt-all')) document.getElementById('cnt-all').innerText = counts.all;
      if (document.getElementById('cnt-pending')) document.getElementById('cnt-pending').innerText = counts.pending;
      if (document.getElementById('cnt-processing')) document.getElementById('cnt-processing').innerText = counts.processing;
      if (document.getElementById('cnt-delivered')) document.getElementById('cnt-delivered').innerText = counts.delivered;
      if (document.getElementById('cnt-cancelled')) document.getElementById('cnt-cancelled').innerText = counts.cancelled;

      renderOrdersListTable();
    }"""

    replacement_load_orders = """    /* ORDERS MANAGEMENT (STRICTLY ONLINE STORE PURCHASES) */
    async function loadOrders() {
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

      try {
        const { data: sbOrders } = await sb.from('orders').select('*').order('created_at', { ascending: false });
        if (sbOrders && sbOrders.length > 0) {
          sbOrders.forEach(o => {
            if (isStrictOnlineStoreOrder(o)) rawOnlineOrders.push(o);
          });
        }
      } catch (e) {}

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

      updateOnlineOrdersCountPills();
      renderOrdersListTable();
    }"""

    if target_load_orders in content:
        content = content.replace(target_load_orders, replacement_load_orders)
        print("  Replaced loadOrders with strict online store loader")
    else:
        print("  Warning: target_load_orders not matched exactly")

    # 2. Update renderJournalLedger
    target_ledger = """    function renderJournalLedger() {
      const thead = document.getElementById('journal-thead');
      const tbody = document.getElementById('journal-tbody');
      if (!thead || !tbody) return;
      let deliveredOrders = allOrders.filter(o => o.status === 'delivered' || !o.status);"""

    replacement_ledger = """    function renderJournalLedger() {
      const thead = document.getElementById('journal-thead');
      const tbody = document.getElementById('journal-tbody');
      if (!thead || !tbody) return;
      const ledgerSource = (offlineCounterBills && offlineCounterBills.length > 0) ? offlineCounterBills : allOrders;
      let deliveredOrders = ledgerSource.filter(o => o.status === 'delivered' || !o.status);"""

    if target_ledger in content:
        content = content.replace(target_ledger, replacement_ledger)
        print("  Updated renderJournalLedger to use offlineCounterBills")
    else:
        print("  Warning: target_ledger not matched exactly")

    # 3. Update updatePaymentBreakdown
    target_pay = """    function updatePaymentBreakdown() {
      if (!allOrders || allOrders.length === 0) return;
      let cashTotal = 0, upiTotal = 0, creditTotal = 0;
      let cashCount = 0, upiCount = 0, creditCount = 0;

      allOrders.forEach(o => {"""

    replacement_pay = """    function updatePaymentBreakdown() {
      const breakSource = (offlineCounterBills && offlineCounterBills.length > 0) ? offlineCounterBills : allOrders;
      if (!breakSource || breakSource.length === 0) return;
      let cashTotal = 0, upiTotal = 0, creditTotal = 0;
      let cashCount = 0, upiCount = 0, creditCount = 0;

      breakSource.forEach(o => {"""

    if target_pay in content:
        content = content.replace(target_pay, replacement_pay)
        print("  Updated updatePaymentBreakdown to use breakSource")
    else:
        print("  Warning: target_pay not matched exactly")

    # 4. Update completePosSale in admin
    target_pos_sale = """        // Deduct inventory stock
        posCart.forEach(cartItem => {
          const prod = allProducts.find(p => String(p.id) === String(cartItem.id));
          if (prod) {
            const currentStock = parseInt(prod.stock !== undefined ? prod.stock : (prod.stock_quantity !== undefined ? prod.stock_quantity : 50));
            prod.stock = Math.max(0, currentStock - cartItem.qty);
            prod.stock_quantity = prod.stock;
          }
        });

        // Add to allOrders at the very top
        allOrders.unshift(newOrder);

        // Persist local counter POS orders & enqueue for cloud sync
        try {
          const storedPosOrders = JSON.parse(localStorage.getItem('nsn_pos_orders') || '[]');
          storedPosOrders.unshift(newOrder);
          localStorage.setItem('nsn_pos_orders', JSON.stringify(storedPosOrders));

          // Enqueue for cloud sync & trigger background sync
          const syncQueue = JSON.parse(localStorage.getItem('nsn_pending_sync_queue') || '[]');
          syncQueue.unshift(newOrder);
          localStorage.setItem('nsn_pending_sync_queue', JSON.stringify(syncQueue));
          if (typeof triggerManualSync === 'function') triggerManualSync();
        } catch(e) {}

        // Persist to Supabase if accessible
        try {
          const tenantId = sessionStorage.getItem('nsn_tenant_id') || '37a64e83-514d-4b00-b90a-9af172dacdd6';
          await sb.from('orders').insert({
            tenant_id: tenantId,
            total_amount: netTotal,
            payment_method: newOrder.payment_method,
            shipping_address: newOrder.shipping_address,
            status: 'delivered'
          });
        } catch(e) {}

        playPosBeep();
        setTimeout(playPosBeep, 120);

        if (document.getElementById('cnt-all')) document.getElementById('cnt-all').innerText = allOrders.length.toLocaleString('en-IN');
        if (document.getElementById('cnt-delivered')) document.getElementById('cnt-delivered').innerText = allOrders.filter(o => o.status === 'delivered' || !o.status).length.toLocaleString('en-IN');
        if (document.getElementById('stat-orders')) document.getElementById('stat-orders').innerText = allOrders.length.toLocaleString('en-IN');

        renderOrdersListTable();"""

    replacement_pos_sale = """        // Deduct inventory stock
        posCart.forEach(cartItem => {
          const prod = allProducts.find(p => String(p.id) === String(cartItem.id));
          if (prod) {
            const currentStock = parseInt(prod.stock !== undefined ? prod.stock : (prod.stock_quantity !== undefined ? prod.stock_quantity : 50));
            prod.stock = Math.max(0, currentStock - cartItem.qty);
            prod.stock_quantity = prod.stock;
          }
        });

        // Add to offlineCounterBills at the very top (Counter POS bill, not online order)
        newOrder.source = 'Offline POS';
        newOrder.is_offline_bill = true;
        offlineCounterBills.unshift(newOrder);

        // Persist local counter POS orders & enqueue for cloud sync
        try {
          const storedPosOrders = JSON.parse(localStorage.getItem('nsn_pos_orders') || '[]');
          storedPosOrders.unshift(newOrder);
          localStorage.setItem('nsn_pos_orders', JSON.stringify(storedPosOrders));

          // Enqueue for cloud sync & trigger background sync
          const syncQueue = JSON.parse(localStorage.getItem('nsn_pending_sync_queue') || '[]');
          syncQueue.unshift(newOrder);
          localStorage.setItem('nsn_pending_sync_queue', JSON.stringify(syncQueue));
          if (typeof triggerManualSync === 'function') triggerManualSync();
        } catch(e) {}

        // Persist to Supabase if accessible
        try {
          const tenantId = sessionStorage.getItem('nsn_tenant_id') || '37a64e83-514d-4b00-b90a-9af172dacdd6';
          await sb.from('orders').insert({
            tenant_id: tenantId,
            total_amount: netTotal,
            payment_method: newOrder.payment_method,
            shipping_address: newOrder.shipping_address,
            status: 'delivered'
          });
        } catch(e) {}

        playPosBeep();
        setTimeout(playPosBeep, 120);

        if (document.getElementById('stat-orders')) {
          const totalBills = (offlineCounterBills.length || 0) + (allOrders.length || 0);
          document.getElementById('stat-orders').innerText = totalBills.toLocaleString('en-IN');
        }
        updateOnlineOrdersCountPills();"""

    if target_pos_sale in content:
        content = content.replace(target_pos_sale, replacement_pos_sale)
        print("  Updated completePosSale to isolate counter bills into offlineCounterBills")
    else:
        print("  Warning: target_pos_sale not matched exactly")

    # 5. Update date filter fallback and analytics fallback
    target_date_orders = """      } else {
        const dateOrders = allOrders.filter(o => {
          const oDateStr = (o.voucher_date || new Date(o.created_at).toISOString().slice(0, 10));
          return oDateStr === pickerVal && o.status !== 'cancelled';
        });"""

    replacement_date_orders = """      } else {
        const orderPool = (offlineCounterBills && offlineCounterBills.length > 0) ? offlineCounterBills : allOrders;
        const dateOrders = orderPool.filter(o => {
          const oDateStr = (o.voucher_date || new Date(o.created_at).toISOString().slice(0, 10));
          return oDateStr === pickerVal && o.status !== 'cancelled';
        });"""

    if target_date_orders in content:
        content = content.replace(target_date_orders, replacement_date_orders)
        print("  Updated date filter orderPool calculation")
    else:
        print("  Warning: target_date_orders not matched exactly")

    target_chart_orders = """      } else {
        // Fallback calculation from allOrders
        let validOrders = allOrders.filter(o => o.status !== 'cancelled');"""

    replacement_chart_orders = """      } else {
        // Fallback calculation from offlineCounterBills & allOrders
        const orderPool = (offlineCounterBills && offlineCounterBills.length > 0) ? offlineCounterBills : allOrders;
        let validOrders = orderPool.filter(o => o.status !== 'cancelled');"""

    if target_chart_orders in content:
        content = content.replace(target_chart_orders, replacement_chart_orders)
        print("  Updated chart calculation orderPool")
    else:
        print("  Warning: target_chart_orders not matched exactly")

    # 6. Add live online order poller to Admin
    poller_code = """    // Live Poller: stream new customer orders placed from mobile storefront directly into Admin
    let lastKnownOnlineOrderCount = -1;
    async function fetchLiveOnlineOrdersInAdmin() {
      try {
        const res = await fetch('/api/orders?status=all').then(r => r.json()).catch(() => null);
        let raw = [];
        if (res && res.success && Array.isArray(res.orders)) {
          raw.push(...res.orders);
        }
        try {
          const local = JSON.parse(localStorage.getItem('nsn_orders') || '[]');
          if (Array.isArray(local)) raw.push(...local);
        } catch(e) {}

        const seen = new Set();
        const freshOrders = [];
        raw.forEach(o => {
          if (!o || !isStrictOnlineStoreOrder(o)) return;
          const k = String(o.id || o.invId || o.voucher_no || '');
          if (!seen.has(k)) {
            seen.add(k);
            freshOrders.push(o);
          }
        });

        if (lastKnownOnlineOrderCount !== -1 && freshOrders.length > lastKnownOnlineOrderCount) {
          if (typeof playPosBeep === 'function') {
            playPosBeep();
            setTimeout(playPosBeep, 160);
          }
          if (typeof showToastNotification === 'function') {
            showToastNotification('🔔 New Online Customer Order Received!', 'success');
          }
        }
        lastKnownOnlineOrderCount = freshOrders.length;

        const currentIds = allOrders.map(o => String(o.id || o.invId)).join(',');
        const newIds = freshOrders.map(o => String(o.id || o.invId)).join(',');
        if (currentIds !== newIds) {
          allOrders = freshOrders;
          updateOnlineOrdersCountPills();
          renderOrdersListTable();
        }
      } catch(e) {
        console.warn('Live online orders poll error:', e);
      }
    }

    // Poll for customer phone orders every 4 seconds
    setInterval(fetchLiveOnlineOrdersInAdmin, 4000);"""

    if "function fetchLiveOnlineOrdersInAdmin" not in content:
        # Place before closing </script>
        content = content.replace("  </script>\n</body>", poller_code + "\n  </script>\n</body>")
        print("  Added fetchLiveOnlineOrdersInAdmin live poller with chime")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Completed {filepath}\n")

if __name__ == '__main__':
    for p in ['admin.html', 'public/admin.html', 'pre_model/admin.html']:
        if os.path.exists(p):
            refine_admin(p)
