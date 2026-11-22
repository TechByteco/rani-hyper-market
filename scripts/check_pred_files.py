import os
for p in ['predicted_5yr_inventory_movement.json', 'api/predicted_5yr_inventory_movement.json', 'data/predicted_5yr_inventory_movement.json']:
    if os.path.exists(p):
        print(f'{p}: {os.path.getsize(p)} bytes')
