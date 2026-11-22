# Patch online-orders.html with Webhook Simulator and WhatsApp E-Bill features
import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean up external script tags
    content = re.sub(
        r'<script src="https://cdn\.tailwindcss\.com">.*?</script>',
        '<script src="https://cdn.tailwindcss.com"></script>',
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/html2canvas/1\.4\.1/html2canvas\.min\.js">.*?</script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>',
        content,
        flags=re.DOTALL
    )

    # 2. Add Webhook Simulator Button in Header Actions if not present
    wh_btn = '''
        <!-- ⚡ Bank Webhook Reconciler (Simulate GPay Alert) -->
        <button type="button" onclick="openWebhookSimulatorModal()" class="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs hover:shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-bolt text-yellow-300 animate-pulse"></i>
          <span>Simulate Bank UPI Alert</span>
        </button>
'''
    if 'openWebhookSimulatorModal' not in content:
        # Insert after <div class="flex items-center gap-2 flex-wrap"> inside header
        hdr_actions_marker = '<!-- Header Actions -->'
        idx = content.find(hdr_actions_marker)
        if idx != -1:
            div_idx = content.find('<div class="flex items-center gap-2 flex-wrap">', idx)
            if div_idx != -1:
                insert_pos = div_idx + len('<div class="flex items-center gap-2 flex-wrap">')
                content = content[:insert_pos] + wh_btn + content[insert_pos:]

    # 3. Add Webhook Simulator Modal before </body> if not present
    wh_modal = '''
  <!-- ⚡ BANK UPI / GPAY WEBHOOK SIMULATOR MODAL -->
  <div id="webhook-sim-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <i class="fa-solid fa-bolt text-emerald-600"></i>
          </div>
          <div>
            <h3 class="font-black text-gray-900 text-sm">UPI Bank Webhook Simulator</h3>
            <p class="text-[11px] text-gray-500">Test zero-touch GPay / UPI reconciliation</p>
          </div>
        </div>
        <button type="button" onclick="closeWebhookSimulatorModal()" class="text-gray-400 hover:text-gray-700 text-lg font-bold">&times;</button>
      </div>

      <p class="text-xs text-gray-600">
        Simulates an incoming real-time credit notification from State Bank of India / Google Pay to <strong class="text-gray-900">saalimin21@oksbi</strong>. The system will auto-match and flip the order to <strong>PAID &amp; VERIFIED</strong> instantly!
      </p>

      <form onsubmit="submitWebhookSimulation(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-gray-700 mb-1">Target Pending Order (Optional)</label>
          <select id="sim-order-select" onchange="autoFillWebhookFields()" class="w-full px-3 py-2 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500">
            <option value="">-- Choose from Pending Orders --</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block font-bold text-gray-700 mb-1">Credit Amount (₹) *</label>
            <input type="number" step="0.01" id="sim-amount" required placeholder="e.g. 235.00" class="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Bank 12-Digit UTR *</label>
            <input type="text" id="sim-utr" required placeholder="e.g. 632819283719" class="w-full px-3 py-2 border border-gray-300 rounded-xl font-mono text-[11px]">
          </div>
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">Payer / Customer Name</label>
          <input type="text" id="sim-sender" placeholder="e.g. Sundarajan (GPay User)" class="w-full px-3 py-2 border border-gray-300 rounded-xl">
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">Transaction Note / Inv ID</label>
          <input type="text" id="sim-note" placeholder="e.g. Payment for #RHM-INV-1004" class="w-full px-3 py-2 border border-gray-300 rounded-xl">
        </div>

        <div class="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
          <button type="button" onclick="closeWebhookSimulatorModal()" class="px-3.5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold">Cancel</button>
          <button type="submit" id="sim-submit-btn" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xs transition active:scale-95 flex items-center gap-1.5">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Simulate Bank Credit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
'''
    if 'id="webhook-sim-modal"' not in content:
        b_idx = content.rfind('</body>')
        if b_idx != -1:
            content = content[:b_idx] + wh_modal + '\n' + content[b_idx:]

    # 4. Add JS methods in script before closing </script>
    js_code = '''
    // =========================================================
    // ⚡ ENTERPRISE UPGRADE: WEBHOOK RECONCILER & WHATSAPP E-BILLS
    // =========================================================
    function openWebhookSimulatorModal() {
      const modal = document.getElementById('webhook-sim-modal');
      const select = document.getElementById('sim-order-select');
      if (select) {
        select.innerHTML = '<option value="">-- Choose from Pending Orders --</option>';
        const unverified = (allOrders || []).filter(o => 
          o.payment_status === 'Awaiting Bank Verification' || o.payment_status === 'Pending' || !o.payment_status
        );
        unverified.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o.id;
          opt.textContent = `${o.invId || o.id} - ${o.customer_name || 'Customer'} (₹${o.total || o.total_amount || 0})`;
          select.appendChild(opt);
        });
        if (unverified.length > 0) {
          select.value = unverified[0].id;
          autoFillWebhookFields();
        } else {
          document.getElementById('sim-amount').value = '150.00';
          document.getElementById('sim-utr').value = '63' + Math.floor(1000000000 + Math.random() * 9000000000);
          document.getElementById('sim-sender').value = 'Sundar (GPay User)';
          document.getElementById('sim-note').value = 'Grocery Payment';
        }
      }
      modal.classList.remove('hidden');
    }

    function closeWebhookSimulatorModal() {
      const modal = document.getElementById('webhook-sim-modal');
      if (modal) modal.classList.add('hidden');
    }

    function autoFillWebhookFields() {
      const select = document.getElementById('sim-order-select');
      const orderId = select.value;
      const order = (allOrders || []).find(o => o.id === orderId);
      if (order) {
        document.getElementById('sim-amount').value = (order.total || order.total_amount || 0);
        document.getElementById('sim-utr').value = order.utr || ('63' + Math.floor(1000000000 + Math.random() * 9000000000));
        document.getElementById('sim-sender').value = (order.customer_name || 'GPay Customer');
        document.getElementById('sim-note').value = 'Payment for ' + (order.invId || order.id);
      }
    }

    async function submitWebhookSimulation(e) {
      e.preventDefault();
      const btn = document.getElementById('sim-submit-btn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      const payload = {
        txnId: 'TXN-' + Date.now(),
        utr: document.getElementById('sim-utr').value.trim(),
        amount: parseFloat(document.getElementById('sim-amount').value),
        sender: document.getElementById('sim-sender').value.trim(),
        note: document.getElementById('sim-note').value.trim(),
        timestamp: new Date().toISOString()
      };

      try {
        const res = await fetch('/api/webhooks/gpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        closeWebhookSimulatorModal();
        if (data.matched) {
          alert('⚡ BANK WEBHOOK RECONCILED!\\n\\n' + data.message + '\\nCustomer: ' + (data.customer || 'Store Shopper'));
        } else {
          alert('⚡ WEBHOOK LOGGED: ' + data.message);
        }
        if (typeof loadOrders === 'function') loadOrders();
        else location.reload();
      } catch (err) {
        alert('Webhook trigger recorded: ' + err.message);
        location.reload();
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Simulate Bank Credit';
      }
    }

    async function sendWhatsAppEbill(orderId) {
      try {
        const res = await fetch('/api/notifications/whatsapp-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        });
        const data = await res.json();
        if (data.success && data.waLink) {
          window.open(data.waLink, '_blank');
          if (typeof showToast === 'function') {
            showToast('📲 WhatsApp Digital Tax Invoice opened for ' + (data.phone || 'Customer'), 'success');
          } else {
            alert('📲 WhatsApp Digital Tax Invoice ready for ' + (data.phone || 'Customer'));
          }
        } else {
          alert('WhatsApp bill status: ' + (data.error || 'Dispatched'));
        }
      } catch (err) {
        alert('WhatsApp dispatch error: ' + err.message);
      }
    }
'''
    if 'openWebhookSimulatorModal' not in content:
        last_script = content.rfind('</script>')
        if last_script != -1:
            content = content[:last_script] + js_code + '\n' + content[last_script:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully patched {filepath}")

patch_file('online-orders.html')
patch_file('public/online-orders.html')
