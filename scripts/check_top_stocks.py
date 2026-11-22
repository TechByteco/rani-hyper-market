import sqlite3

db_path = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT VariantId, Stock FROM ProductVariantStocks WHERE VariantId = 3856")
print("Variant 3856 stock:", cur.fetchone())
cur.execute("SELECT VariantId, Stock FROM ProductVariantStocks ORDER BY Stock DESC LIMIT 5")
print("Top 5 stocks:", cur.fetchall())
conn.close()
