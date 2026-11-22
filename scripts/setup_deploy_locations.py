import os, shutil

src = r'f:\dell intel core i7 pc data\SKS Market\DEPLOY_NOW.bat'

# 1. Location in SKS Market (Active Main Workspace)
loc1 = src

# 2. Location in SKS Market_old (Secondary Workspace)
loc2 = r'f:\dell intel core i7 pc data\SKS Market_old\DEPLOY_NOW.bat'

# 3. Location on Desktop for immediate double-click convenience
loc3 = r'C:\Users\saali\Desktop\DEPLOY_NOW.bat'

with open(src, 'r', encoding='utf-8') as f:
    bat_content = f.read()

# For SKS Market_old and Desktop, ensure cd /d targets the active SKS Market directory
bat_explicit = bat_content.replace('cd /d "%~dp0"', 'cd /d "f:\\dell intel core i7 pc data\\SKS Market"')

with open(loc2, 'w', encoding='utf-8') as f:
    f.write(bat_explicit)
print(f"Created in SKS Market_old: {loc2} ({os.path.getsize(loc2)} bytes)")

try:
    with open(loc3, 'w', encoding='utf-8') as f:
        f.write(bat_explicit)
    print(f"Created on Desktop: {loc3} ({os.path.getsize(loc3)} bytes)")
except Exception as e:
    print(f"Could not write to Desktop: {e}")
