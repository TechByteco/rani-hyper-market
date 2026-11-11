import sqlite3

m_path = r'temp_backup_21oct\database\master.db'
conn = sqlite3.connect(m_path)
cur = conn.cursor()
cur.execute("PRAGMA wal_checkpoint(FULL);")
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Master tables:", [r[0] for r in cur.fetchall()])
cur.execute("SELECT Id, Name, PhoneNumber, AddressLine, Email, TaxNumber FROM Entities")
for r in cur.fetchall():
    print("Entity:", r)
conn.close()
