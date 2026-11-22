# Patch store.html and public/store.html with live stock badges and stock limits
import json, re

# Load stock analysis lookup
with open('data/predicted_5yr_inventory_movement.json', 'r', encoding='utf-8') as f:
    analysis = json.load(f)['products']

title_to_stock = {}
for vid, p in analysis.items():
    t_clean = p['name'].strip().lower()
    title_to_stock[t_clean] = p['predicted_onhand_stock']

def get_predicted_stock_for_title(t):
    t_clean = t.strip().lower()
    if t_clean in title_to_stock:
        return title_to_stock[t_clean]
    for k, v in title_to_stock.items():
        if k in t_clean or t_clean in k:
            return v
    # heuristics
    if any(w in t_clean for w in ['oil', 'ghee', 'rice', 'sugar', 'atta', 'dheepam', 'deepam']):
        return 35
    if any(w in t_clean for w in ['vilakku', 'clay', 'thiri', 'camphor']):
        return 60
    if any(w in t_clean for w in ['batter', 'milk', 'curd', 'bread', 'egg', 'paneer']):
        return 24
    if any(w in t_clean for w in ['snack', 'biscuit', 'soap', 'tea', 'coffee']):
        return 48
    return 15

def patch_store(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Enrich INITIAL_PRODUCTS array with "stock" and "stock_status"
    init_match = re.search(r'const INITIAL_PRODUCTS = .*?(\[\{.*?\}\]);', content, re.DOTALL)
    if init_match:
        raw_json = init_match.group(1)
        try:
            items = json.loads(raw_json)
            for it in items:
                stk = get_predicted_stock_for_title(it['title'])
                it['stock'] = stk
                it['stock_status'] = 'in_stock' if stk >= 8 else 'low_stock'
            new_json = json.dumps(items)
            content = content[:init_match.start(1)] + new_json + content[init_match.end(1):]
            print(f"Enriched {len(items)} INITIAL_PRODUCTS in {filepath}")
        except Exception as e:
            print(f"Error parsing INITIAL_PRODUCTS JSON in {filepath}: {e}")

    # 2. Add visual stock badge in product card template before stepper
    # Target: `<div id="card-stepper-${p.id}">`
    badge_snippet = """
              <!-- Live Stock Availability Badge -->
              <div class="mb-2">
                ${p.stock !== undefined ? (
                  p.stock > 10 ? 
                    `<span class="text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 inline-flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock (${p.stock} left)
                    </span>` :
                  (p.stock > 0 ?
                    `<span class="text-[9px] font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1 animate-pulse">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Only ${p.stock} left in store
                    </span>` :
                    `<span class="text-[9px] font-black text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
                    </span>`)
                ) : ''}
              </div>

              <div id="card-stepper-${p.id}">"""

    if 'Live Stock Availability Badge' not in content:
        content = content.replace('<div id="card-stepper-${p.id}">', badge_snippet)
        print(f"Added Live Stock Availability Badge in {filepath}")

    # 3. Add stock limit check in handleCardStep
    # Find `function handleCardStep`
    step_idx = content.find('function handleCardStep')
    if step_idx != -1 and 'Maximum available stock reached' not in content[step_idx:step_idx+1200]:
        target_check = "if (step > 0) {"
        c_idx = content.find(target_check, step_idx)
        if c_idx != -1:
            stock_guard = """if (step > 0) {
        const prod = allProducts.find(x => String(x.id) === String(productId));
        const curCartQty = existing ? existing.quantity : 0;
        if (prod && prod.stock !== undefined && (curCartQty + step) > prod.stock) {
          if (typeof showToast === 'function') showToast(`Maximum store stock reached for ${prod.title} (${prod.stock} units available)`, 'warning');
          else alert(`Maximum store stock reached (${prod.stock} units in store)`);
          return;
        }"""
            content = content[:c_idx] + stock_guard + content[c_idx + len(target_check):]
            print(f"Added stock quantity guard to handleCardStep in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully patched {filepath}")

patch_store('store.html')
patch_store('public/store.html')
