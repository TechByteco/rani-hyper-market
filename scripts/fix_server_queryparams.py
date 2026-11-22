with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace query?.limit with queryParams.get('limit')
text = text.replace("query?.limit", "queryParams.get('limit')")

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed queryParams in server.js")
