import json

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for fid, info in data.items():
    print(f"\n--- {fid} ---")
    print(f"Name: {info['meta']['name']} ({info['meta']['tamil']})")
    print(f"Tier: {info['meta']['tier']}")
    for yr, m in info['yearly_metrics'].items():
        if m['bills'] > 0:
            print(f"  {yr} [{m['window']}]: ₹{m['turnover']:,.2f} ({m['bills']} bills, AOV: ₹{m['avg_basket']})")
    print("  Top Products:")
    for p in info['all_time_top_products'][:5]:
        trend = " ➜ ".join([f"{y}: {v['qty']}u (₹{v['rev']:,.0f})" for y, v in sorted(p['years'].items())])
        print(f"    * {p['name']}: Total ₹{p['total_rev']:,.0f} | Trend: {trend}")
