import shutil
from patch_online_orders import patch_file

# Patch orders.html and public/orders.html
patch_file('orders.html')
patch_file('public/orders.html')

# Add ebill button
import add_ebill_button_online_orders

print("orders.html and public/orders.html patched successfully!")
