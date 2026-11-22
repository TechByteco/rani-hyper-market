lines = open('scripts/check_all_html_scripts.py', encoding='utf-8').readlines()
for i, l in enumerate(lines):
    print(f'{i+1}: {l}', end='')
