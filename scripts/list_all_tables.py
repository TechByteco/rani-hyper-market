import sqlite3

db_path = r'data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cur.fetchall()]
print("All tables in 2026-2027 DB:")
for t in sorted(tables):
    cur.execute(f"SELECT COUNT(*) FROM {t}")
    cnt = cur.fetchone()[0]
    print(f"  {t} ({cnt} rows)")
conn.close()
