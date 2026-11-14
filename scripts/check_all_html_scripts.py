import os
import subprocess
import glob
import re
import time

html_files = sorted(glob.glob("*.html") + glob.glob("public/*.html"))
print(f"Checking {len(html_files)} HTML files for JavaScript syntax errors...\n")

has_error = False

for path in html_files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Match script tags with attributes
    matches = re.findall(r"<script(\s+[^>]*)?>(.*?)</script>", content, re.DOTALL | re.IGNORECASE)
    idx = 0
    file_ok = True
    for attrs, block in matches:
        if 'application/ld+json' in (attrs or '').lower():
            continue  # JSON-LD metadata, not executable JS
        code = block.strip()
        if not code or code.startswith("<!--") and code.endswith("-->"):
            continue
        idx += 1
        fname = f"temp_chk_{os.path.basename(path)}_{idx}.js"
        with open(fname, "w", encoding="utf-8") as sf:
            sf.write(code)
        
        res = subprocess.run(["node", "--check", fname], capture_output=True, text=True)
        time.sleep(0.01)
        for _ in range(5):
            try:
                if os.path.exists(fname):
                    os.remove(fname)
                break
            except Exception:
                time.sleep(0.05)
                
        if res.returncode != 0:
            print(f"[ERROR] {path} script #{idx} failed syntax check:\n{res.stderr}")
            file_ok = False
            has_error = True
    
    if file_ok:
        print(f"[OK] {path}: ALL {idx} JavaScript scripts valid!")

if not has_error:
    print("\nALL HTML FILES ARE 100% VALID JAVASCRIPT!")
