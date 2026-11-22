with open('ai-analytics.html', 'rb') as f:
    content = f.read()

with open('public/ai-analytics.html', 'wb') as f:
    f.write(content)

print(f"Synced ai-analytics.html -> public/ai-analytics.html ({len(content)} bytes)")
