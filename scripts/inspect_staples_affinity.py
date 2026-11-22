import sqlite3
from collections import defaultdict

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

query = """
SELECT t.Id, p.Name, p.CategoryId, tp.Price, tp.Quantity
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

baskets = defaultdict(set)
item_info = {}

for trans_id, name, cat_id, price, qty in rows:
    clean = name.strip()
    baskets[trans_id].add(clean)
    if clean not in item_info:
        item_info[clean] = {'price': price, 'cat_id': cat_id}

total_baskets = len(baskets)

# Check pairs involving Rice, Oil, Dal, Sugar, Milk, Egg, Pooja, Spices
target_keywords = ['rice', 'oil', 'dal', 'parupu', 'sugar', 'milk', 'egg', 'ghee', 'atta', 'flour', 'deepam', 'turmeric', 'chilli', 'coriander', 'snack', 'biscuit', 'soap', 'tea', 'coffee']

item_counts = defaultdict(int)
for b in baskets.values():
    for item in b:
        item_counts[item] += 1

pair_counts = defaultdict(int)
for b in baskets.values():
    items = sorted(list(b))
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            pair_counts[(items[i], items[j])] += 1

staples_rules = []
for (item_a, item_b), joint_cnt in pair_counts.items():
    if joint_cnt < 2:
        continue
    
    cnt_a = item_counts[item_a]
    cnt_b = item_counts[item_b]
    
    supp_ab = joint_cnt / total_baskets
    supp_a = cnt_a / total_baskets
    supp_b = cnt_b / total_baskets
    lift = supp_ab / (supp_a * supp_b)
    
    if lift > 1.8:
        conf_a_b = joint_cnt / cnt_a
        conf_b_a = joint_cnt / cnt_b
        staples_rules.append({
            'item_a': item_a,
            'item_b': item_b,
            'joint_count': joint_cnt,
            'support': round(supp_ab, 5),
            'confidence_a_to_b': round(conf_a_b, 4),
            'confidence_b_to_a': round(conf_b_a, 4),
            'lift': round(lift, 2)
        })

staples_rules.sort(key=lambda x: -x['lift'])
print(f"Total High-Affinity Pairs (Lift > 1.8): {len(staples_rules):,}")
print("\nSample High-Affinity Staples Pairs:")
for r in staples_rules[:20]:
    print(f"  {r['item_a']} + {r['item_b']} | Joint: {r['joint_count']}, Lift: {r['lift']}x, Conf(A->B): {r['confidence_a_to_b']*100:.1f}%")

conn.close()
