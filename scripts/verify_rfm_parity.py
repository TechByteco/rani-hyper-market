import filecmp
import os

files = [
    'customer_rfm_partitions.json',
    'data/customer_rfm_partitions.json',
    'public/customer_rfm_partitions.json',
    'api/data/customer_rfm_partitions.json'
]

print("Checking customer_rfm_partitions.json across tiers:")
for f in files:
    print(f" - {f}: exists={os.path.exists(f)}, size={os.path.getsize(f) if os.path.exists(f) else 'N/A'}")

identical = all(filecmp.cmp('customer_rfm_partitions.json', f, shallow=False) for f in files[1:])
print(f"All 4 customer_rfm_partitions.json files 100% binary identical: {identical}")

# Also check services
print("services/rfmSegmentationService.js <==> api/services/rfmSegmentationService.js:", filecmp.cmp('services/rfmSegmentationService.js', 'api/services/rfmSegmentationService.js', shallow=False))
