import sqlite3
db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("PRAGMA table_info(ProductVariants);")
print('ProductVariants columns:', [row[1] for row in cur.fetchall()])
conn.close()
