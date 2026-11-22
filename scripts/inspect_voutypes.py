import sqlite3

db_path = 'data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT VouType, COUNT(*) FROM Transactions GROUP BY VouType;")
print('VouTypes in Transactions:', cur.fetchall())

cur.execute("""
SELECT t.VouType, COUNT(DISTINCT t.Id), COUNT(tp.TransId)
FROM Transactions t
JOIN TransProducts tp ON t.Id = tp.TransId
GROUP BY t.VouType;
""")
print('\nVouTypes with TransProducts:', cur.fetchall())

conn.close()
