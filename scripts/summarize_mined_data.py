import json

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for fid, info in data.items():
    name = info['meta']['name']
    tamil = info['meta']['tamil']
    tier = info['meta']['tier']
    print(f"\n{'='*70}\n🌟 FESTIVAL: {name} | {tamil}\nTier: {tier}\n{'='*70}")
    
    print("📅 YEAR-WISE TURNOVER & BILLING VOLUME:")
    for yr, m in sorted(info['yearly_metrics'].items()):
        print(f"  • FY {yr}: Window [{m['window']}] -> Revenue: ₹{m['turnover']:>10,.2f} | Invoices: {m['bills']:>4} | AOV: ₹{m['avg_basket']}")

    print("\n🏆 KEY PRODUCT SALES & YoY DEMAND GROWTH TRAJECTORY:")
    for i, p in enumerate(info['all_time_top_products'][:10]):
        growth_parts = []
        years_sorted = sorted(p['years'].keys())
        for y in years_sorted:
            y_info = p['years'][y]
            growth_parts.append(f"{y}: {y_info['qty']}u (₹{y_info['rev']:,.0f})")
            
        print(f"  {i+1:2d}. {p['name']:<35} | Total: ₹{p['total_rev']:>8,.0f} ({p['total_qty']:>6.1f} units)")
        print(f"      Trend: {' ➜ '.join(growth_parts)}")
