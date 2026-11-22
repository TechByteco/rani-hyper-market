import sqlite3, json

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Check sample transaction products join
query = """
SELECT 
    t.Id as TransId,
    t.VoucherNo,
    t.VoucherDate,
    tp.VariantId,
    p.Name as ProductName,
    pv.Name as VariantName,
    tp.Quantity,
    tp.Price,
    tp.Amount
FROM Transactions t
JOIN TransProducts tp ON t.Id = tp.TransId
JOIN ProductVariants pv ON tp.VariantId = pv.Id
JOIN Products p ON pv.ProductId = p.Id
WHERE t.VouType = 27
LIMIT 20;
"""

cur.execute(query)
rows = cur.fetchall()
print('Sample transaction product rows:')
for r in rows[:10]:
    print(' ', r[0], r[1], r[2], f"VarId:{r[3]}", r[4], f"({r[5]})", f"Qty:{r[6]}", f"₹{r[7]}")

# Check how many distinct baskets exist in 2026-2027
cur.execute("""
SELECT COUNT(DISTINCT t.Id)
FROM Transactions t
JOIN TransProducts tp ON t.Id = tp.TransId
WHERE t.VouType = 27;
""")
print('\nTotal distinct transaction baskets in active DB:', cur.fetchone()[0])

conn.close()
