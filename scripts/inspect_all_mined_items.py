import json

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    mined_data = json.load(f)

print(f"{'#':<3} {'Festival ID':<28} {'Mined Years':<12} {'Top 3 Empirical Items'}")
print("-" * 95)
for i, (fid, f) in enumerate(mined_data.items()):
    years = list(f.get('yearly_metrics', {}).keys())
    years_str = ','.join(years) if years else 'Master fallback'
    top_items = [it['name'] for it in f.get('recommended_stock_needs', [])[:3]]
    top_str = '; '.join(top_items)
    print(f"{i+1:<3} {fid:<28} {years_str:<12} {top_str}")
