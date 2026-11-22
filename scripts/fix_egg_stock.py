import sqlite3

db_path = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Delete the reconciliation posting that triggered the auto-addition
cur.execute("DELETE FROM StockPostings WHERE TransId = 999999")

# Set exact on-hand stock for 3856
cur.execute("UPDATE ProductVariantStocks SET Stock = 120.0 WHERE VariantId = 3856")
conn.commit()

cur.execute("SELECT VariantId, Stock FROM ProductVariantStocks ORDER BY Stock DESC LIMIT 10")
print("Top 10 stocks after adjustment:")
for row in cur.fetchall():
    print(" ", row)

conn.close()
