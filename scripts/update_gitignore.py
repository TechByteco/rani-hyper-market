with open('.gitignore', 'r', encoding='utf-8') as f:
    text = f.read()

old_sec = """# Local SQLite databases & backups
data/
data - 25-26/
data_rani/
*.db"""

new_sec = """# Local SQLite databases & backups
data/*.db
data/*/*.db
data_rani/
data - 25-26/
*.db

# Allow tracking of essential JSON datasets for Vercel Serverless
!data/online_orders.json
!data/tenants.json
!data/store_admins.json
!data/supabase_dump/
!data/supabase_dump/*
!data/inventory_5yr_reconciled.json
!data/delta_sync_log.json
!api/data/
!api/data/*"""

if old_sec in text:
    text = text.replace(old_sec, new_sec)
    with open('.gitignore', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated .gitignore')
else:
    print('Could not find old section')
