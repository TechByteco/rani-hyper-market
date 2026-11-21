with open('server.js', 'r', encoding='utf-8') as f:
    code = f.read()

if 'const PORT = 5500;' in code:
    code = code.replace('const PORT = 5500;', 'const PORT = process.env.PORT || 5500;', 1)
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Updated server.js to use process.env.PORT || 5500!")
else:
    print("Already updated or not found")
