import sqlite3

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("""
SELECT MIN(VoucherDate), MAX(VoucherDate), COUNT(DISTINCT Id)
FROM (
    SELECT Id, VoucherDate
    FROM Transactions
    WHERE VouType = 27
    ORDER BY Id
    LIMIT 17547
);
""")
row = cur.fetchone()
print(f"17,547 vouchers span from {row[0]} to {row[1]} (Count: {row[2]:,})")

cur.execute("""
SELECT COUNT(DISTINCT tp.VariantId), COUNT(DISTINCT p.Id)
FROM Transactions t
JOIN TransProducts tp ON t.Id = tp.TransId
JOIN ProductVariants pv ON tp.VariantId = pv.Id
JOIN Products p ON pv.ProductId = p.Id
WHERE t.Id IN (
    SELECT Id FROM Transactions WHERE VouType = 27 ORDER BY Id LIMIT 17547
);
""")
row2 = cur.fetchone()
print(f"Distinct SKUs in these 17,547 vouchers: {row2[0]:,} variants, {row2[1]:,} products")

conn.close()
