import re, os, subprocess

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r"<script(\s+[^>]*)?>(.*?)</script>", content, re.DOTALL | re.IGNORECASE)
idx = 0
for attrs, block in matches:
    if 'application/ld+json' in (attrs or '').lower():
        continue
    code = block.strip()
    if not code or code.startswith("<!--") and code.endswith("-->"):
        continue
    idx += 1
    fname = f"test_err_{idx}.js"
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(code)
    res = subprocess.run(["node", "--check", fname], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Script #{idx} failed:")
        print(res.stderr)
        lines = code.splitlines()
        # Find where error occurred
        for i, l in enumerate(lines):
            if i >= 340 and i <= 360:
                print(f"{i+1}: {l}")
    if os.path.exists(fname):
        os.remove(fname)
