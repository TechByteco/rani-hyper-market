import re, subprocess, glob, os

html_files = sorted(list(set(glob.glob('public/*.html') + [f for f in glob.glob('*.html') if not f.startswith('temp')])))
print(f"Checking {len(html_files)} HTML files for JavaScript syntax errors...\n")

for hfile in html_files:
    with open(hfile, 'r', encoding='utf-8') as f:
        content = f.read()

    scripts = re.findall(r'<script\b(?![^>]*type=[\'"]application/ld\+json[\'"])[^>]*>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
    errors = []

    for i, s in enumerate(scripts):
        if not s.strip():
            continue
        fname = 'temp_check_single.js'
        with open(fname, 'w', encoding='utf-8') as sf:
            sf.write(s)
        res = subprocess.run(['node', '-c', fname], capture_output=True, text=True)
        if res.returncode != 0:
            err_line = res.stderr.strip().split('\n')[0]
            err_details = '\n'.join(res.stderr.strip().split('\n')[:5])
            errors.append((i, err_line, err_details))
        if os.path.exists(fname):
            os.remove(fname)

    if errors:
        print(f"[ERROR] {hfile}: {len(errors)} error(s)")
        for err in errors:
            print(f"   Script tag #{err[0]}:\n{err[2]}\n")
    else:
        print(f"[OK] {hfile}: ALL {len(scripts)} scripts valid!")
