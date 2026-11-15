import sqlite3

db = "data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/377e6769-67d1-42b8-a49d-0a6aedfd26a6_2024-2025.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

print("Transactions columns:")
cur.execute("PRAGMA table_info(Transactions);")
for col in cur.fetchall():
    print(f"  {col[1]} ({col[2]})")

print("\nTransProducts columns:")
cur.execute("PRAGMA table_info(TransProducts);")
for col in cur.fetchall():
    print(f"  {col[1]} ({col[2]})")

conn.close()
