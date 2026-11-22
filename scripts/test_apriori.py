import sqlite3
from collections import defaultdict
import time

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

print("Extracting 17,547 transaction baskets...")
start_time = time.time()

# 1. Query the 17,547 transactions
query = """
SELECT t.Id, p.Name, tp.Price
FROM Transactions t
JOIN TransProducts tp ON t.Id = tp.TransId
JOIN ProductVariants pv ON tp.VariantId = pv.Id
JOIN Products p ON pv.ProductId = p.Id
WHERE t.Id IN (
    SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id LIMIT 17547
)
"""

cur.execute(query)
rows = cur.fetchall()
print(f"Fetched {len(rows):,} item lines in {time.time() - start_time:.2f}s")

# Group into baskets
baskets = defaultdict(set)
item_prices = {}
for trans_id, prod_name, price in rows:
    clean_name = prod_name.strip()
    baskets[trans_id].add(clean_name)
    if clean_name not in item_prices:
        item_prices[clean_name] = price

total_baskets = len(baskets)
print(f"Total Baskets: {total_baskets:,}")

# Count 1-itemsets
item_counts = defaultdict(int)
for b in baskets.values():
    for item in b:
        item_counts[item] += 1

print(f"Total Unique Items in Baskets: {len(item_counts):,}")

# Filter items with count >= 5
frequent_items = {item: cnt for item, cnt in item_counts.items() if cnt >= 5}
print(f"Frequent items (count >= 5): {len(frequent_items):,}")

# Count 2-itemsets
pair_counts = defaultdict(int)
for b in baskets.values():
    filtered_basket = sorted([item for item in b if item in frequent_items])
    for i in range(len(filtered_basket)):
        for j in range(i + 1, len(filtered_basket)):
            pair = (filtered_basket[i], filtered_basket[j])
            pair_counts[pair] += 1

print(f"Total unique item pairs: {len(pair_counts):,}")

# Calculate metrics for pairs
high_lift_pairs = []
for (item_a, item_b), joint_cnt in pair_counts.items():
    if joint_cnt < 3:
        continue
    
    cnt_a = item_counts[item_a]
    cnt_b = item_counts[item_b]
    
    supp_ab = joint_cnt / total_baskets
    supp_a = cnt_a / total_baskets
    supp_b = cnt_b / total_baskets
    
    conf_a_b = joint_cnt / cnt_a
    conf_b_a = joint_cnt / cnt_b
    
    lift = supp_ab / (supp_a * supp_b)
    
    if lift > 1.8:
        high_lift_pairs.append({
            'item_a': item_a,
            'item_b': item_b,
            'joint_count': joint_cnt,
            'support': round(supp_ab, 5),
            'confidence_a_to_b': round(conf_a_b, 4),
            'confidence_b_to_a': round(conf_b_a, 4),
            'lift': round(lift, 2)
        })

high_lift_pairs.sort(key=lambda x: -x['lift'])
print(f"\nTotal High-Affinity Pairs with Lift > 1.8: {len(high_lift_pairs):,}")
print("\nTop 15 High-Affinity Pairs by Lift:")
for p in high_lift_pairs[:15]:
    print(f"  {p['item_a']}  <--->  {p['item_b']}")
    print(f"    Joint Count: {p['joint_count']}, Conf(A->B): {p['confidence_a_to_b']*100:.1f}%, Lift: {p['lift']}x")

conn.close()
