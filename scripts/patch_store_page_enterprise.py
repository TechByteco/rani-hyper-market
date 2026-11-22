# Patch store.html and public/store.html with Zero-Waste Flash Markdown Shelf and WhatsApp E-Bill Option

zero_waste_shelf_html = """
    <!-- ⚡ ZERO-WASTE FRESH MARKDOWN SHELF (20% OFF NEAR-EXPIRY) -->
    <section id="zero-waste-shelf" class="max-w-7xl mx-auto w-full px-3 sm:px-6 mb-6">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-green-950 p-4 sm:p-5 text-white shadow-xl border border-emerald-400/40">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-black tracking-wider uppercase border border-white/30 text-emerald-100">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              🌱 Bodinayakanur Zero-Waste Initiative • 20% OFF Daily Fresh Items
            </div>
            <h2 class="text-lg sm:text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>⚡ Near-Expiry Fresh Deals Shelf</span>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-400 text-gray-950 shadow-xs">Flash Sale</span>
            </h2>
            <p class="text-xs sm:text-sm text-emerald-100 max-w-2xl font-medium">
              100% fresh morning batches (Batter, Milk, Curd, Bread, Eggs, Paneer) nearing nightly shelf-life. Inspected &amp; guaranteed fresh for today's cooking at unbeatable 20% discount. Delivered in 30 mins!
            </p>
          </div>
          <div class="shrink-0 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-400/30">
            <i class="fa-solid fa-stopwatch text-yellow-300 text-base animate-pulse"></i>
            <div>
              <span class="block text-[9px] uppercase tracking-wider text-emerald-200 font-bold">Flash Deals End In:</span>
              <span id="flash-deal-countdown" class="font-mono text-sm font-black text-yellow-300">03h 42m 18s</span>
            </div>
          </div>
        </div>

        <!-- Deals Grid -->
        <div id="flash-deals-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          <!-- Populated by renderFlashDeals() -->
        </div>
      </div>
    </section>
"""

wa_checkbox_html = """
        <!-- WhatsApp E-Bill Option -->
        <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
          <input type="checkbox" id="send-wa-ebill" checked class="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer">
          <label for="send-wa-ebill" class="text-xs text-emerald-950 font-bold cursor-pointer">
            <span>📲 Send Instant WhatsApp E-Bill &amp; Live Tracking</span>
            <span class="block text-[10px] text-emerald-700 font-normal">Receive digital tax invoice and live rider alerts on WhatsApp (Paperless &amp; Eco-friendly).</span>
          </label>
        </div>
"""

store_js_code = """
    // =====================================================================
    // ⚡ ZERO-WASTE FRESH MARKDOWN ENGINE & FLASH DEALS
    // =====================================================================
    let activeFlashDeals = [
      { id: 'fd_batter', name: 'Fresh Dosa Batter 900g', original_price: 35, flash_price: 28, discount: '20% OFF', note: 'Morning batch • Valid today', emoji: '🥣', stock: 18 },
      { id: 'fd_milk', name: 'Fresh Cow Milk 500ml', original_price: 28, flash_price: 22, discount: '21% OFF', note: 'Dairy fresh • Boil today', emoji: '🥛', stock: 12 },
      { id: 'fd_curd', name: 'Farm Fresh Curd 400g', original_price: 35, flash_price: 28, discount: '20% OFF', note: 'Creamy curd • Perfect for mor', emoji: '🍶', stock: 9 },
      { id: 'fd_bread', name: 'Whole Wheat Bread 400g', original_price: 45, flash_price: 34, discount: '24% OFF', note: 'Soft loaf • Baked fresh', emoji: '🍞', stock: 7 },
      { id: 'fd_eggs', name: 'Farm Brown Eggs (6 pcs)', original_price: 48, flash_price: 38, discount: '20% OFF', note: 'Grade-A fresh eggs', emoji: '🥚', stock: 15 },
      { id: 'fd_paneer', name: 'Malai Paneer 200g', original_price: 95, flash_price: 76, discount: '20% OFF', note: 'Soft cubes • Vacuum sealed', emoji: '🧀', stock: 8 }
    ];

    async function loadFreshMarkdowns() {
      try {
        const res = await fetch('/api/inventory/fresh-markdowns');
        const data = await res.json();
        if (data && data.deals && data.deals.length > 0) {
          activeFlashDeals = data.deals.map(d => ({
            id: 'fd_' + d.id,
            name: d.name,
            original_price: d.original_price,
            flash_price: d.flash_price,
            discount: d.discount_pct + '% OFF',
            note: d.shelf_life_note || 'Inspected fresh',
            emoji: d.image_emoji || '🥗',
            stock: d.stock_units || 10
          }));
        }
      } catch(e) {}
      renderFlashDeals();
      startFlashCountdown();
    }

    function renderFlashDeals() {
      const container = document.getElementById('flash-deals-grid');
      if (!container) return;
      container.innerHTML = activeFlashDeals.map(d => `
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition group">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1.5">
              <span class="text-xl">${d.emoji}</span>
              <span class="px-1.5 py-0.5 rounded-md bg-yellow-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">${d.discount}</span>
            </div>
            <h4 class="font-bold text-xs text-white line-clamp-2 leading-tight">${d.name}</h4>
            <p class="text-[9px] text-emerald-200 mt-0.5 font-medium line-clamp-1">${d.note}</p>
          </div>
          <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1">
            <div>
              <span class="line-through text-emerald-300/80 text-[10px] block">₹${d.original_price}</span>
              <strong class="text-yellow-300 text-sm font-black">₹${d.flash_price}</strong>
            </div>
            <button type="button" onclick="addFlashDealToCart('${d.id}')" class="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-xs transition active:scale-90 flex items-center gap-1 cursor-pointer">
              <i class="fa-solid fa-plus text-[10px]"></i> Deal
            </button>
          </div>
        </div>
      `).join('');
    }

    function addFlashDealToCart(dealId) {
      const deal = activeFlashDeals.find(d => d.id === dealId);
      if (!deal) return;

      const existing = cart.find(x => String(x.id) === String(deal.id));
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: deal.id,
          title: `[⚡ Flash Deal] ${deal.name}`,
          price: deal.flash_price,
          mrp: deal.original_price,
          quantity: 1,
          unit: '1 item',
          image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&q=80',
          is_flash_deal: true
        });
      }

      try {
        localStorage.setItem('nsn_cart', JSON.stringify(cart));
      } catch(e) {}
      updateCartUI();

      if (typeof showToast === 'function') {
        showToast(`⚡ Added ${deal.name} at ₹${deal.flash_price} (Saved ₹${deal.original_price - deal.flash_price})!`, 'success');
      } else {
        alert(`⚡ Added ${deal.name} at ₹${deal.flash_price}!`);
      }
    }

    function startFlashCountdown() {
      function tick() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);
        const diff = Math.max(0, midnight - now);
        const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const mins = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const secs = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
        const elem = document.getElementById('flash-deal-countdown');
        if (elem) elem.textContent = `${hrs}h ${mins}m ${secs}s`;
      }
      tick();
      setInterval(tick, 1000);
    }

    // Initialize fresh markdowns on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadFreshMarkdowns();
    });
"""

def patch_store_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Insert Zero-Waste Shelf after karthigai-festival-banner </section>
    if 'id="zero-waste-shelf"' not in content:
        target = 'id="karthigai-festival-banner"'
        idx = content.find(target)
        if idx != -1:
            end_sec = content.find('</section>', idx) + 10
            content = content[:end_sec] + '\n' + zero_waste_shelf_html + content[end_sec:]

    # 2. Insert WhatsApp E-Bill checkbox before submit button in checkout form
    if 'id="send-wa-ebill"' not in content:
        sub_btn = 'id="btn-submit-order"'
        idx = content.find(sub_btn)
        if idx != -1:
            div_before = content.rfind('<div', 0, idx)
            content = content[:div_before] + wa_checkbox_html + '\n        ' + content[div_before:]

    # 3. Add JS in main script before </script>
    if 'loadFreshMarkdowns' not in content:
        last_script = content.rfind('</script>')
        if last_script != -1:
            content = content[:last_script] + store_js_code + '\n' + content[last_script:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully patched {filepath}")

patch_store_file('store.html')
patch_store_file('public/store.html')
