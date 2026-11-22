with open('store.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('karthigai-festival-banner')
end_sec = text.find('</section>', idx) + 10
print(text[end_sec:end_sec+500])
