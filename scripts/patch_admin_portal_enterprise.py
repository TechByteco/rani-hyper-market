# Script to patch admin.html and public/admin.html with RBAC, Shift Z-Report, and Delta Sync Daemon

rbac_css = """
    /* RBAC Dynamic Masking Styles */
    body[data-rhm-role="cashier"] .rbac-profit,
    body[data-rhm-role="cashier"] #sync-stat-profit,
    body[data-rhm-role="cashier"] #stat-margin-label,
    body[data-rhm-role="cashier"] .profit-figure,
    body[data-rhm-role="cashier"] [data-financial="true"] {
      filter: blur(5px) !important;
      user-select: none !important;
      pointer-events: none !important;
    }
    body[data-rhm-role="cashier"] #admin-store-heading::after {
      content: " • Counter Cashier Mode (Margins Masked)";
      font-size: 11px;
      color: #047857;
      font-weight: 700;
    }
    body[data-rhm-role="inventory"] .rbac-profit,
    body[data-rhm-role="inventory"] #sync-stat-profit,
    body[data-rhm-role="inventory"] #stat-margin-label {
      display: none !important;
    }
"""

rbac_header_html = """
          <!-- 👑 RBAC Counter Role Switcher -->
          <div class="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold" id="rbac-role-switcher" title="Switch Operating Role">
            <button type="button" onclick="switchRbacRole('owner')" id="role-btn-owner" class="px-2.5 py-1 rounded-lg text-emerald-900 bg-white shadow-2xs transition font-black">👑 Owner</button>
            <button type="button" onclick="switchRbacRole('cashier')" id="role-btn-cashier" class="px-2.5 py-1 rounded-lg text-gray-600 hover:text-gray-900 transition font-bold">💻 Cashier</button>
            <button type="button" onclick="switchRbacRole('inventory')" id="role-btn-inventory" class="px-2.5 py-1 rounded-lg text-gray-600 hover:text-gray-900 transition font-bold">📦 Floor</button>
          </div>

          <!-- 💵 Shift Drawer & Z-Report Button -->
          <button type="button" onclick="openShiftDrawerModal()" class="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer" title="Shift Drawer & Z-Report Reconciliation">
            <i class="fa-solid fa-cash-register text-purple-600"></i>
            <span class="hidden md:inline">Shift &amp; Z-Report</span>
          </button>
"""

shift_modal_html = """
  <!-- 💵 SHIFT DRAWER & Z-REPORT RECONCILIATION MODAL -->
  <div id="shift-drawer-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-black">
            <i class="fa-solid fa-cash-register"></i>
          </div>
          <div>
            <h3 class="font-black text-gray-900 text-base">Counter Shift &amp; Cash Drawer</h3>
            <p class="text-xs text-gray-500 font-semibold" id="shift-drawer-subtitle">Cash Reconciliation &amp; Z-Report</p>
          </div>
        </div>
        <button type="button" onclick="closeShiftDrawerModal()" class="text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>

      <!-- Active Shift Status Card -->
      <div id="shift-active-view" class="space-y-4">
        <div class="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Counter Shift
            </span>
            <span id="shift-status-pill" class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">OPEN</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-gray-500 block">Cashier on Duty:</span>
              <strong id="shift-cashier-name" class="text-gray-900 font-black text-sm">Murugan (Counter #1)</strong>
            </div>
            <div>
              <span class="text-gray-500 block">Shift Opened:</span>
              <strong id="shift-opened-time" class="text-gray-900 font-bold">Today, 08:30 AM</strong>
            </div>
            <div>
              <span class="text-gray-500 block">Opening Cash Float:</span>
              <strong id="shift-opening-cash" class="text-gray-900 font-black text-sm">₹2,000.00</strong>
            </div>
            <div>
              <span class="text-gray-500 block">Cash Sales Collected:</span>
              <strong id="shift-cash-sales" class="text-emerald-700 font-black text-sm">₹14,350.00</strong>
            </div>
          </div>
          <div class="pt-2 border-t border-purple-200/50 flex items-center justify-between">
            <span class="text-xs font-bold text-gray-700">Expected Physical Cash in Drawer:</span>
            <span id="shift-expected-cash" class="text-base font-black text-purple-900">₹16,350.00</span>
          </div>
        </div>

        <!-- Reconciliation Input Form -->
        <div class="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
          <h4 class="text-xs font-black text-gray-900 uppercase">End-of-Shift Cash Count</h4>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Counted Physical Cash in Till (₹) *</label>
            <input type="number" step="0.01" id="shift-counted-cash" oninput="calculateShiftOverShort()" placeholder="Enter counted rupees" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-black text-base text-gray-900 focus:ring-2 focus:ring-purple-500">
          </div>
          <div id="shift-diff-box" class="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between text-xs font-bold">
            <span class="text-gray-600">Register Variance:</span>
            <span id="shift-variance-text" class="text-gray-800">Enter cash count above</span>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Shift Notes / Register Handover Memo</label>
            <input type="text" id="shift-notes" placeholder="e.g. Handed over to night shift cashier" class="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs">
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button type="button" onclick="closeShiftDrawerModal()" class="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button type="button" onclick="submitShiftClose()" class="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1.5">
            <i class="fa-solid fa-file-invoice-dollar"></i>
            <span>Close Shift &amp; Print Z-Report</span>
          </button>
        </div>
      </div>

      <!-- Printable Z-Report View (Hidden by default, shown on close) -->
      <div id="shift-zreport-view" class="hidden space-y-3">
        <div id="printable-z-report" class="p-4 bg-white border border-gray-300 rounded-xl font-mono text-xs text-gray-800 space-y-2">
          <!-- Populated by JS -->
        </div>
        <div class="flex items-center justify-end gap-2">
          <button type="button" onclick="printShiftZReport()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5">
            <i class="fa-solid fa-print"></i> Print Z-Report
          </button>
          <button type="button" onclick="closeShiftDrawerModal()" class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold">Done</button>
        </div>
      </div>
    </div>
  </div>
"""

admin_js_code = """
    // =====================================================================
    // 👑 RBAC ROLE SWITCHER & RECONCILIATION SUITE
    // =====================================================================
    function switchRbacRole(role) {
      document.body.dataset.rhmRole = role;
      localStorage.setItem('rhm_role', role);

      const btns = {
        owner: document.getElementById('role-btn-owner'),
        cashier: document.getElementById('role-btn-cashier'),
        inventory: document.getElementById('role-btn-inventory')
      };

      Object.keys(btns).forEach(k => {
        if (!btns[k]) return;
        if (k === role) {
          btns[k].className = 'px-2.5 py-1 rounded-lg text-emerald-900 bg-white shadow-2xs transition font-black';
        } else {
          btns[k].className = 'px-2.5 py-1 rounded-lg text-gray-600 hover:text-gray-900 transition font-bold';
        }
      });

      if (role === 'cashier') {
        if (typeof showToast === 'function') {
          showToast('💻 Cashier Mode Activated: Wholesale purchase costs & net margins are protected.', 'info');
        } else {
          alert('💻 Cashier Mode Activated: Wholesale purchase costs & net margins are protected.');
        }
      } else if (role === 'owner') {
        if (typeof showToast === 'function') {
          showToast('👑 Owner Mode Active: Full financial transparency unlocked.', 'success');
        }
      } else if (role === 'inventory') {
        if (typeof showToast === 'function') {
          showToast('📦 Floor Mode: Stock counts & packing prioritized.', 'info');
        }
      }
    }

    // Initialize Role on Page Load
    document.addEventListener('DOMContentLoaded', function() {
      const savedRole = localStorage.getItem('rhm_role') || 'owner';
      switchRbacRole(savedRole);
      initOfflineSyncDaemon();
    });

    // =====================================================================
    // 💵 SHIFT DRAWER & Z-REPORT SYSTEM
    // =====================================================================
    let activeShiftData = null;

    async function openShiftDrawerModal() {
      const modal = document.getElementById('shift-drawer-modal');
      const activeView = document.getElementById('shift-active-view');
      const zreportView = document.getElementById('shift-zreport-view');
      activeView.classList.remove('hidden');
      zreportView.classList.add('hidden');

      try {
        const res = await fetch('/api/pos/shift/current');
        const data = await res.json();
        if (data.isOpen && data.shift) {
          activeShiftData = data.shift;
          document.getElementById('shift-status-pill').textContent = 'OPEN';
          document.getElementById('shift-cashier-name').textContent = activeShiftData.cashierName || 'Counter #1 Cashier';
          document.getElementById('shift-opened-time').textContent = new Date(activeShiftData.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          document.getElementById('shift-opening-cash').textContent = '₹' + parseFloat(activeShiftData.openingCash || 0).toFixed(2);
          document.getElementById('shift-cash-sales').textContent = '₹' + parseFloat(activeShiftData.cashSales || 0).toFixed(2);
          document.getElementById('shift-expected-cash').textContent = '₹' + parseFloat(activeShiftData.expectedCash || 0).toFixed(2);
          document.getElementById('shift-counted-cash').value = '';
          document.getElementById('shift-variance-text').textContent = 'Enter cash count above';
        } else {
          // Open new shift prompt
          const openNow = confirm('No active shift is currently open. Would you like to open Shift for Counter #1 with ₹2,000 float?');
          if (openNow) {
            await fetch('/api/pos/shift/open', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cashierName: 'Murugan (Counter #1)', counterNo: 'Counter #1', openingCash: 2000 })
            });
            return openShiftDrawerModal();
          }
          return;
        }
      } catch (err) {
        console.error('Failed to load shift:', err);
      }

      modal.classList.remove('hidden');
    }

    function closeShiftDrawerModal() {
      const modal = document.getElementById('shift-drawer-modal');
      if (modal) modal.classList.add('hidden');
    }

    function calculateShiftOverShort() {
      if (!activeShiftData) return;
      const counted = parseFloat(document.getElementById('shift-counted-cash').value) || 0;
      const expected = parseFloat(activeShiftData.expectedCash || 0);
      const diff = counted - expected;
      const varianceElem = document.getElementById('shift-variance-text');
      if (Math.abs(diff) < 0.01) {
        varianceElem.innerHTML = '<span class="text-emerald-700 font-black">✅ EXACT MATCH (Balanced ₹0.00)</span>';
      } else if (diff > 0) {
        varianceElem.innerHTML = `<span class="text-blue-700 font-black">📈 OVER BY ₹${diff.toFixed(2)}</span>`;
      } else {
        varianceElem.innerHTML = `<span class="text-red-700 font-black">⚠️ SHORT BY ₹${Math.abs(diff).toFixed(2)}</span>`;
      }
    }

    async function submitShiftClose() {
      const counted = parseFloat(document.getElementById('shift-counted-cash').value);
      if (isNaN(counted)) {
        alert('Please enter the physical cash counted in the drawer.');
        return;
      }
      const notes = document.getElementById('shift-notes').value.trim();

      try {
        const res = await fetch('/api/pos/shift/close', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ countedCash: counted, notes })
        });
        const data = await res.json();
        if (data.success && data.zReport) {
          renderZReportSlip(data.zReport);
        } else {
          alert('Shift close notice: ' + (data.message || 'Complete'));
          closeShiftDrawerModal();
        }
      } catch (err) {
        alert('Error closing shift: ' + err.message);
      }
    }

    function renderZReportSlip(zr) {
      document.getElementById('shift-active-view').classList.add('hidden');
      const zview = document.getElementById('shift-zreport-view');
      zview.classList.remove('hidden');

      const slip = document.getElementById('printable-z-report');
      slip.innerHTML = `
        <div class="text-center pb-2 border-b border-dashed border-gray-400">
          <h2 class="font-bold text-sm">RANI HYPER MARKET</h2>
          <p class="text-[10px]">93 Sundara Pandian St, Bodinayakanur</p>
          <p class="text-[10px] font-bold mt-1">*** OFFICIAL SHIFT Z-REPORT ***</p>
          <p class="text-[9px]">Z-REPORT NO: ${zr.zReportNo}</p>
          <p class="text-[9px]">TIME: ${new Date(zr.closedAt).toLocaleString('en-IN')}</p>
        </div>
        <div class="py-2 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
          <div class="flex justify-between"><span>COUNTER:</span><span>${zr.counterNo}</span></div>
          <div class="flex justify-between"><span>CASHIER:</span><span>${zr.cashierName}</span></div>
          <div class="flex justify-between"><span>BILLS PUNCHED:</span><span>${zr.billsCount}</span></div>
        </div>
        <div class="py-2 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
          <div class="flex justify-between"><span>OPENING CASH:</span><span>₹${zr.openingCash.toFixed(2)}</span></div>
          <div class="flex justify-between"><span>CASH SALES:</span><span>₹${zr.cashSales.toFixed(2)}</span></div>
          <div class="flex justify-between"><span>UPI / GPAY SALES:</span><span>₹${zr.upiSales.toFixed(2)}</span></div>
          <div class="flex justify-between font-bold"><span>TOTAL SALES:</span><span>₹${zr.totalSales.toFixed(2)}</span></div>
        </div>
        <div class="py-2 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
          <div class="flex justify-between"><span>EXPECTED CASH:</span><span>₹${zr.expectedCash.toFixed(2)}</span></div>
          <div class="flex justify-between"><span>COUNTED CASH:</span><span>₹${zr.countedCash.toFixed(2)}</span></div>
          <div class="flex justify-between font-bold ${zr.overShort === 0 ? 'text-emerald-700' : (zr.overShort > 0 ? 'text-blue-700' : 'text-red-700')}">
            <span>VARIANCE:</span><span>${zr.status} (₹${Math.abs(zr.overShort).toFixed(2)})</span>
          </div>
        </div>
        <div class="text-center pt-2 text-[9px] text-gray-500">
          <p>Register reconciled and verified.</p>
          <p>Manager Signature: __________________</p>
        </div>
      `;
    }

    function printShiftZReport() {
      const slip = document.getElementById('printable-z-report').innerHTML;
      const w = window.open('', '_blank');
      w.document.write('<html><head><title>Shift Z-Report</title><style>body{font-family:monospace;width:80mm;margin:0 auto;padding:10px;}</style></head><body>' + slip + '</body></html>');
      w.document.close();
      w.focus();
      w.print();
    }

    // =====================================================================
    // 🟢 CONTINUOUS 2-WAY DELTA SYNC DAEMON
    // =====================================================================
    function initOfflineSyncDaemon() {
      const syncBadge = document.getElementById('cloud-sync-badge');
      const syncText = document.getElementById('cloud-sync-text');
      const syncDot = document.getElementById('cloud-sync-dot');

      function updateOnlineStatus() {
        if (navigator.onLine) {
          if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
          if (syncText) syncText.textContent = 'Cloud: Synced';
          flushOfflineSyncQueue();
        } else {
          if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-amber-500 animate-pulse';
          if (syncText) syncText.textContent = 'Offline Buffer (Saved)';
          if (typeof showToast === 'function') {
            showToast('⚠️ Internet drop detected. Offline counter buffer engaged.', 'warning');
          }
        }
      }

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    }

    async function triggerManualSync() {
      const syncText = document.getElementById('cloud-sync-text');
      if (syncText) syncText.textContent = 'Syncing...';
      try {
        await flushOfflineSyncQueue();
        const res = await fetch('/api/sync/delta');
        const data = await res.json();
        if (syncText) syncText.textContent = 'Cloud: Synced';
        if (typeof showToast === 'function') {
          showToast('🟢 2-Way Delta Sync complete: Cloud & SQLite live in parity.', 'success');
        } else {
          alert('🟢 2-Way Delta Sync complete: Cloud & SQLite live in parity.');
        }
      } catch (err) {
        if (syncText) syncText.textContent = 'Cloud: Sync Error';
      }
    }

    async function flushOfflineSyncQueue() {
      try {
        const queue = JSON.parse(localStorage.getItem('rhm_offline_queue') || '[]');
        if (queue.length > 0) {
          const res = await fetch('/api/sync/delta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ batch: queue, counterId: 'POS-Counter-1' })
          });
          const data = await res.json();
          if (data.success) {
            localStorage.removeItem('rhm_offline_queue');
            if (typeof showToast === 'function') {
              showToast(`Uploaded ${data.processedCount} offline bills to cloud!`, 'success');
            }
          }
        }
      } catch (err) {
        console.warn('Sync queue flush deferred:', err);
      }
    }
"""

def patch_admin_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Insert CSS
    if 'RBAC Dynamic Masking Styles' not in content:
        head_end = content.find('</head>')
        if head_end != -1:
            content = content[:head_end] + '<style>' + rbac_css + '</style>\n' + content[head_end:]

    # 2. Insert Header elements
    if 'id="rbac-role-switcher"' not in content:
        target = '<!-- Right Quick Actions -->'
        idx = content.find(target)
        if idx != -1:
            div_start = content.find('<div class="flex items-center gap-2 flex-wrap">', idx)
            if div_start != -1:
                insert_pos = div_start + len('<div class="flex items-center gap-2 flex-wrap">')
                content = content[:insert_pos] + rbac_header_html + content[insert_pos:]

    # 3. Insert Modal before </body>
    if 'id="shift-drawer-modal"' not in content:
        body_end = content.rfind('</body>')
        if body_end != -1:
            content = content[:body_end] + shift_modal_html + '\n' + content[body_end:]

    # 4. Insert JS in main script before </script>
    if 'function switchRbacRole' not in content:
        last_script = content.rfind('</script>')
        if last_script != -1:
            content = content[:last_script] + admin_js_code + '\n' + content[last_script:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully patched {filepath}")

patch_admin_file('admin.html')
patch_admin_file('public/admin.html')
