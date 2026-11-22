import re

print("=== WIRING COMPLETE BASKET AFFINITY & CROSS-SELL TO STOREFRONT ===")

with open('store.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update initStore to call loadMarketBasketAffinity()
if "loadMarketBasketAffinity();" not in c:
    c = c.replace("loadStoreProducts();", "loadStoreProducts();\n      loadMarketBasketAffinity();")
    print("1. Added loadMarketBasketAffinity() to initStore()")

# 2. Update renderProductsList to include high-affinity pill
# Find category span and add high-affinity badge
old_cat_block = """<span class="text-emerald-700 uppercase tracking-wider font-extrabold truncate max-w-[130px]">${p.category || 'GROCERY'}</span>"""
new_cat_block = """<span class="text-emerald-700 uppercase tracking-wider font-extrabold truncate max-w-[130px]">${p.category || 'GROCERY'}</span>
                  ${(window.hasAffinityPair && window.hasAffinityPair(p.id, p.title)) ? '<span class="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.2 rounded-full inline-flex items-center gap-1 shadow-2xs" title="Frequently co-purchased grocery combo (Lift > 1.8x)"><i class="fa-solid fa-sparkles text-[8px] text-amber-500"></i> High Lift</span>' : ''}"""

if old_cat_block in c and "title=\"Frequently co-purchased grocery combo (Lift > 1.8x)\"" not in c:
    c = c.replace(old_cat_block, new_cat_block)
    print("2. Added High Lift Combo badge to product cards in renderProductsList()")

# 3. Update openProductQuickView to populate combo box
qv_target = "document.getElementById('product-quick-view-modal').classList.remove('hidden');"
qv_injection = """
      // Populate AI High-Affinity Cross-Sell Combo (Agent 1 Miner Lift > 1.8x)
      const comboContainer = document.getElementById('qv-affinity-combo-box');
      if (comboContainer) {
        const pairs = window.getAffinityPairsFor ? window.getAffinityPairsFor(p.id, p.title) : [];
        if (pairs.length > 0) {
          const topPair = pairs[0];
          const companionProd = allProducts.find(x => String(x.id) === String(topPair.companionId) || (x.title && x.title.toLowerCase().trim() === topPair.companionTitle.toLowerCase().trim()));
          if (companionProd) {
            const compImg = getRelevantProductImage(companionProd.title, companionProd.image_url, companionProd.id);
            const bundlePrice = topPair.pair?.merchandising_strategy?.bundle_offer_price || ((sellRate + parseFloat(companionProd.price)) * 0.95);
            const regPrice = topPair.pair?.merchandising_strategy?.regular_combo_mrp || (sellRate + parseFloat(companionProd.price));
            const savingsVal = regPrice - bundlePrice;

            document.getElementById('qv-affinity-lift-badge').innerText = 'Lift ' + (topPair.pair?.metrics?.lift ? topPair.pair.metrics.lift.toFixed(1) : '2.0') + 'x';
            document.getElementById('qv-affinity-item-img').src = compImg;
            document.getElementById('qv-affinity-item-title').innerText = companionProd.title;
            document.getElementById('qv-affinity-bundle-price').innerText = 'Combo ₹' + Math.round(bundlePrice);
            document.getElementById('qv-affinity-regular-price').innerText = '₹' + Math.round(regPrice);
            document.getElementById('qv-affinity-savings').innerText = 'Save ₹' + Math.round(savingsVal);
            
            const addBtn = document.getElementById('qv-affinity-add-btn');
            addBtn.onclick = function(e) {
              window.addComboToCart(p.id, companionProd.id, e);
            };

            comboContainer.classList.remove('hidden');
          } else {
            comboContainer.classList.add('hidden');
          }
        } else {
          comboContainer.classList.add('hidden');
        }
      }

      """

if "Populate AI High-Affinity Cross-Sell Combo" not in c:
    c = c.replace(qv_target, qv_injection + qv_target)
    print("3. Injected combo rendering into openProductQuickView()")

# 4. Replace renderCartCrossSell with intelligent affinity miner cross-sell
old_render_cart_cross_sell = """function renderCartCrossSell() {
      const container = document.getElementById('cart-cross-sell-items');
      if (!container) return;

      const cartIds = new Set(cart.map(i => String(i.id)));
      const candidates = allProducts.filter(p => !cartIds.has(String(p.id)) && parseFloat(p.price) > 0).slice(0, 6);
      
      if (candidates.length === 0) {
        container.innerHTML = '<span class="text-[11px] text-gray-400">All daily essentials added!</span>';
        return;
      }

      container.innerHTML = candidates.map(p => {
        const finalImg = getRelevantProductImage(p.title, p.image_url, p.id);
        return `
          <div class="flex-shrink-0 w-32 bg-white p-2 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div class="w-full h-16 rounded-lg overflow-hidden bg-gray-50 mb-1.5 flex items-center justify-center">
              <img src="${finalImg}" alt="${p.title}" class="w-full h-full object-cover">
            </div>
            <h6 class="text-[11px] font-bold text-gray-900 truncate" title="${p.title}">${p.title}</h6>
            <div class="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
              <span class="text-[11px] font-black text-emerald-700">₹${parseFloat(p.price).toFixed(0)}</span>
              <button type="button" onclick="handleCardAdd('${p.id}', event)" class="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white font-extrabold text-[10px] transition active:scale-95">
                + Add
              </button>
            </div>
          </div>
        `;
      }).join('');
    }"""

new_render_cart_cross_sell = """function renderCartCrossSell() {
      const container = document.getElementById('cart-cross-sell-items');
      if (!container) return;

      const cartIds = new Set(cart.map(i => String(i.id)));
      let candidates = [];

      // Priority 1: High-affinity companion products based on items already in cart (Lift > 1.8x)
      if (window.affinityPairMap && window.affinityPairMap.size > 0 && cart.length > 0) {
        cart.forEach(ci => {
          const pairs = window.getAffinityPairsFor ? window.getAffinityPairsFor(ci.id, ci.title) : [];
          pairs.forEach(p => {
            if (!cartIds.has(String(p.companionId))) {
              const prod = allProducts.find(x => String(x.id) === String(p.companionId) || (x.title && x.title.toLowerCase().trim() === p.companionTitle.toLowerCase().trim()));
              if (prod && !candidates.some(c => String(c.prod.id) === String(prod.id))) {
                candidates.push({ prod, lift: p.pair?.metrics?.lift, reason: 'Paired with ' + ci.title.slice(0, 14) + '...' });
              }
            }
          });
        });
      }

      // Priority 2: Top grocery cross-sell pairs from mined catalog (17.5K checkout vouchers)
      if (candidates.length < 6 && window.affinityData?.top_grocery_cross_sell_pairs) {
        window.affinityData.top_grocery_cross_sell_pairs.forEach(pair => {
          [pair.item_a, pair.item_b].forEach(item => {
            const pId = String(item.product_id);
            if (!cartIds.has(pId) && !candidates.some(c => String(c.prod.id) === pId)) {
              const prod = allProducts.find(x => String(x.id) === pId || (x.title && x.title.toLowerCase().trim() === item.name.toLowerCase().trim()));
              if (prod) {
                candidates.push({ prod, lift: pair.metrics?.lift, reason: 'High-Lift Bundle' });
              }
            }
          });
        });
      }

      // Priority 3: Fallback general active products
      if (candidates.length < 6) {
        const fallbacks = allProducts.filter(p => !cartIds.has(String(p.id)) && parseFloat(p.price) > 0 && !candidates.some(c => String(c.prod.id) === String(p.id))).slice(0, 6 - candidates.length);
        fallbacks.forEach(p => candidates.push({ prod: p, lift: null, reason: 'Daily Essential' }));
      }

      candidates = candidates.slice(0, 8);

      if (candidates.length === 0) {
        container.innerHTML = '<span class="text-[11px] text-gray-400">All daily essentials added!</span>';
        return;
      }

      container.innerHTML = candidates.map(({ prod: p, lift, reason }) => {
        const finalImg = getRelevantProductImage(p.title, p.image_url, p.id);
        return `
          <div class="flex-shrink-0 w-36 bg-white p-2 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between relative">
            ${lift ? `
              <span class="absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black bg-emerald-600 text-white shadow-2xs">
                ⚡ ${lift >= 10 ? lift.toFixed(0) : lift.toFixed(1)}x Lift
              </span>
            ` : ''}
            <div class="w-full h-16 rounded-lg overflow-hidden bg-gray-50 mb-1.5 flex items-center justify-center">
              <img src="${finalImg}" alt="${p.title}" class="w-full h-full object-cover">
            </div>
            <h6 class="text-[11px] font-bold text-gray-900 truncate" title="${p.title}">${p.title}</h6>
            <span class="text-[9px] text-emerald-700 font-semibold truncate">${reason}</span>
            <div class="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
              <span class="text-[11px] font-black text-emerald-800">₹${parseFloat(p.price).toFixed(0)}</span>
              <button type="button" onclick="handleCardAdd('${p.id}', event)" class="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white font-extrabold text-[10px] transition active:scale-95">
                + Add
              </button>
            </div>
          </div>
        `;
      }).join('');
    }"""

if old_render_cart_cross_sell in c:
    c = c.replace(old_render_cart_cross_sell, new_render_cart_cross_sell)
    print("4. Replaced renderCartCrossSell() with intelligent affinity miner cross-sell")
else:
    print("renderCartCrossSell() old block not found or already replaced")

with open('store.html', 'w', encoding='utf-8') as f:
    f.write(c)

with open('public/store.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Saved store.html and public/store.html successfully.")
