import sqlite3

db = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/e9fbf397-e600-42c9-b58d-ce75c17cb81b_2023-2024.db'
conn = sqlite3.connect(db)
cur = conn.cursor()
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='index';")
indices = cur.fetchall()
conn.close()

print(f"Total indices in DB: {len(indices)}")
for idx in indices:
    print(f"  {idx[0]}: {idx[1]}")
