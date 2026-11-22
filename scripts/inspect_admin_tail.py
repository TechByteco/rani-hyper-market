with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('admin.html length:', len(text))
last_script = text.rfind('</script>')
print('Last script ends at:', last_script)
last_body = text.rfind('</body>')
print('Body ends at:', last_body)
print('Tail:')
print(text[last_script-300:last_script+50])
