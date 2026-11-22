import json, os

pred_file = 'predicted_5yr_inventory_movement.json'
fest_file = 'festival_empirical_turnover_master.json'

print('Checking 5-year master datasets...')
if os.path.exists(pred_file):
    pred_data = json.load(open(pred_file, encoding='utf-8'))
    print(f'predicted_5yr_inventory_movement: {len(pred_data)} items')
    sample = list(pred_data.items())[0] if isinstance(pred_data, dict) else pred_data[0]
    print('  Sample:', sample)

if os.path.exists(fest_file):
    fest_data = json.load(open(fest_file, encoding='utf-8'))
    print(f'festival_empirical_turnover_master: {len(fest_data)} festivals')
    sample_fest = list(fest_data.items())[0] if isinstance(fest_data, dict) else fest_data[0]
    print('  Sample festival:', sample_fest)
