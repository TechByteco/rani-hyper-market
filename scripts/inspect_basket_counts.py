import sqlite3

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT MIN(VoucherDate), MAX(VoucherDate) FROM Transactions WHERE VouType=27")
print('Date range for VouType 27:', cur.fetchone())

cur.execute("""
SELECT COUNT(DISTINCT t.Id), COUNT(DISTINCT tp.VariantId)
FROM Transactions t
JOIN TransProducts tp ON t.Id = tp.TransId
WHERE t.VouType = 27;
""")
print('VouType 27 transactions and distinct variants:', cur.fetchone())

# Let's check multi-item baskets (where basket size >= 2)
cur.execute("""
SELECT COUNT(*) FROM (
    SELECT t.Id, COUNT(tp.VariantId) as item_cnt
    FROM Transactions t
    JOIN TransProducts tp ON t.Id = tp.TransId
    WHERE t.VouType = 27
    GROUP BY t.Id
    HAVING item_cnt >= 2
);
""")
print('Baskets with >= 2 items:', cur.fetchone()[0])

# Check total active products with SKU / barcode
cur.execute("SELECT COUNT(DISTINCT Id) FROM Products WHERE IsActive = 1;")
print('Active Products count:', cur.fetchone()[0])

cur.execute("SELECT COUNT(DISTINCT Id) FROM ProductVariants WHERE IsActive = 1;")
print('Active ProductVariants count:', cur.fetchone()[0])

conn.close()
