import json
from evaluate_dead_stock import dead_stock_candidates

# Group by category
by_cat = {}
for c in dead_stock_candidates:
    cat = c['category'] or 'general_provisions'
    if cat not in by_cat:
        by_cat[cat] = []
    by_cat[cat].append(c)

print("Dead Stock SKUs by Category:")
for cat, items in by_cat.items():
    tot_locked = sum(x['capital_locked'] for x in items)
    print(f"  {cat}: {len(items)} items | Locked: Rs. {tot_locked:,.2f}")

# Look for household cleaners, dishwashing liquids, toiletries, spices, personal care
keywords = ['dish', 'liquid', 'wash', 'cleaner', 'vim', 'exo', 'pril', 'soap', 'shampoo', 'paste', 'tea', 'biscuit', 'masala', 'atta']
matched = [c for c in dead_stock_candidates if any(k in c['name'].lower() for k in keywords)]
print(f"\nDead stock household / grocery FMCG matching keywords: {len(matched)}")
for m in matched[:15]:
    print(f"  {m['name']} | Stock: {m['current_stock']} | Landed: Rs.{m['landed_cost']} | SalesRate: Rs.{m['sales_rate']} | Stagnant: {m['days_stagnant']}d | Locked: Rs.{m['capital_locked']:,.2f}")
