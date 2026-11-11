import os
import shutil
import sqlite3

backup_dir = r'temp_backup_21oct\database'
dest_c = r'C:\SKS Market\Data\database'
dest_local = r'data\database'

tenant_uuid = '37a64e83-514d-4b00-b90a-9af172dacdd6'

print("--- Starting Database Synchronization from 21-Oct-2026 Backup ---")

for dest in [dest_c, dest_local]:
    os.makedirs(dest, exist_ok=True)
    os.makedirs(os.path.join(dest, tenant_uuid), exist_ok=True)

    # 1. Master DB
    for f in os.listdir(backup_dir):
        fp = os.path.join(backup_dir, f)
        if os.path.isfile(fp):
            shutil.copy2(fp, os.path.join(dest, f))
            print(f"Copied {f} -> {dest}")

    # 2. Tenant DBs
    tenant_src = os.path.join(backup_dir, tenant_uuid)
    tenant_dest = os.path.join(dest, tenant_uuid)
    for f in os.listdir(tenant_src):
        fp = os.path.join(tenant_src, f)
        if os.path.isfile(fp):
            shutil.copy2(fp, os.path.join(tenant_dest, f))
            print(f"Copied {f} -> {tenant_dest}")

    # 3. Checkpoint WAL files on dest
    for root, dirs, files in os.walk(dest):
        for f in files:
            if f.endswith('.db'):
                db_path = os.path.join(root, f)
                try:
                    conn = sqlite3.connect(db_path)
                    cur = conn.cursor()
                    cur.execute("PRAGMA wal_checkpoint(FULL);")
                    res = cur.fetchall()
                    conn.close()
                    print(f"Checkpointed {f}: {res}")
                except Exception as e:
                    print(f"Error checkpointing {f}: {e}")

print("--- Database Synchronization Completed Successfully! ---")
