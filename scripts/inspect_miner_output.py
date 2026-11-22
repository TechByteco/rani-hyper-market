import json

data = json.load(open('high_affinity_cross_sells.json', encoding='utf-8'))

print("=== METADATA ===")
print(json.dumps(data['metadata'], indent=2))

print("\n=== EXECUTIVE KPIS ===")
print(json.dumps(data['executive_kpis'], indent=2))

print("\n=== TOP 5 CROSS-SELL PAIRS ===")
for p in data['top_grocery_cross_sell_pairs'][:5]:
    print(f"[{p['pair_id']}] {p['item_a']['name']}  <===>  {p['item_b']['name']}")
    print(f"   Joint: {p['joint_occurrences']}, Supp: {p['metrics']['support']}, Conf(A->B): {p['metrics']['confidence_a_to_b']*100:.1f}%, Lift: {p['metrics']['lift']}x")
    print(f"   Action: {p['merchandising_strategy']['action']}")

print("\n=== TOP 5 OVERSTOCKED INVENTORY ALERTS (DOI > 60 DAYS) ===")
for a in data['overstocked_inventory_alerts'][:5]:
    print(f"[{a['urgency']}] {a['sku_name']}")
    print(f"   Stock: {a['current_stock']} units | 30D Sales: {a['sales_last_30d']} | DOI: {a['days_of_inventory_doi']} days")
    print(f"   Locked Capital: ₹{a['capital_locked_inr']:,.2f} | Action: {a['recommended_action']}")

print("\n=== TOP 5 FAST-MOVING STOCKOUT RISKS (DOI < 15 DAYS) ===")
for s in data['critical_stockout_reorder_alerts'][:5]:
    print(f"[{s['urgency']}] {s['sku_name']}")
    print(f"   Stock: {s['current_stock']} units | Burn Rate: {s['average_daily_sales_ads']} units/day | DOI: {s['days_of_inventory_doi']} days")
