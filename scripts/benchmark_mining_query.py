import sqlite3, time

db = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db'
conn = sqlite3.connect(db)
cur = conn.cursor()

# Test with Subquery
t0 = time.time()
cur.execute("""
    SELECT p.Name as product_name,
           round(sum(tp.Quantity), 1) as qty,
           round(sum(tp.NetValue), 2) as rev,
           count(distinct t.Id) as buyer_bills,
           round(avg(tp.Price), 2) as avg_price,
           round(sum(tp.Profit), 2) as profit
    FROM Transactions t
    JOIN TransProducts tp ON tp.TransId = t.Id
    JOIN ProductVariants pv ON tp.VariantId = pv.Id
    JOIN Products p ON pv.ProductId = p.Id
    WHERE t.VouType = 27 AND t.VoucherDate >= '2023-11-10' AND t.VoucherDate <= '2023-11-13' AND tp.Quantity < 5000
    GROUP BY p.Name
    ORDER BY rev DESC
    LIMIT 25
""")
rows = cur.fetchall()
t1 = time.time()
print(f"Elapsed: {t1 - t0:.3f}s, Rows returned: {len(rows)}")
for r in rows[:5]:
    print(" ", r)
conn.close()
