import json

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Festivals in mined data:', list(data.keys()))
sample_fest = data['karthigai_deepam']
print('\nKeys in karthigai_deepam:')
for k in sample_fest.keys():
    print(f'  {k}: {type(sample_fest[k])}')

print('\nMeta:', json.dumps(sample_fest.get('meta', {}), indent=2))
print('\nYearly metrics:', json.dumps(sample_fest.get('yearly_metrics', {}), indent=2))
print('\nTop 3 recommended_stock_needs:')
print(json.dumps(sample_fest.get('recommended_stock_needs', [])[:3], indent=2))
print('\nTop 3 all_time_top_products:')
print(json.dumps(sample_fest.get('all_time_top_products', [])[:3], indent=2))
