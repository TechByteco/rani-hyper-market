import urllib.request, json

print("Testing GET /api/analytics/basket-affinity...")
try:
    with urllib.request.urlopen("http://localhost:5500/api/analytics/basket-affinity") as res:
        data = json.loads(res.read().decode())
        print("HTTP Status:", res.status)
        print("Success:", data.get('success'))
        print("Agent Name:", data.get('metadata', {}).get('agent_name'))
        print("KPIs:", data.get('executive_kpis'))
        print("Top Cross-Sell Pairs Count:", len(data.get('top_grocery_cross_sell_pairs', [])))
        p = data.get('top_grocery_cross_sell_pairs', [])[0]
        print(f"Sample Pair: {p['item_a']['name']} <---> {p['item_b']['name']} (Lift: {p['metrics']['lift']}x)")
except Exception as e:
    print("Error:", e)

print("\nTesting GET /api/analytics/doi-alerts...")
try:
    with urllib.request.urlopen("http://localhost:5500/api/analytics/doi-alerts") as res:
        data = json.loads(res.read().decode())
        print("HTTP Status:", res.status)
        print("Overstocked Alerts Count:", len(data.get('overstocked_alerts_doi_gt_60', [])))
        print("Critical Stockouts Count:", len(data.get('critical_stockout_alerts_doi_lt_15', [])))
        a = data.get('overstocked_alerts_doi_gt_60', [])[0]
        print(f"Top Overstock SKU: {a['sku_name']} | Stock: {a['current_stock']} | DOI: {a['days_of_inventory_doi']} days | Locked: ₹{a['capital_locked_inr']:,.2f}")
except Exception as e:
    print("Error:", e)
