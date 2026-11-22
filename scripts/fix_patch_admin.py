# Ensure JS is properly inserted in admin.html and public/admin.html
with open('scripts/patch_admin_portal_enterprise.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace condition
code = code.replace("if 'switchRbacRole' not in content:", "if 'function switchRbacRole' not in content:")

with open('scripts/patch_admin_portal_enterprise.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated condition in scripts/patch_admin_portal_enterprise.py")
