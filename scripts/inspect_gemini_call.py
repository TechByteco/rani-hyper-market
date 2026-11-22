with open('generativeAiAdvisor.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'callGeminiApi'
idx = c.find(target)
if idx != -1:
    print('Found callGeminiApi at', idx)
    print(c[idx:idx+2000])
else:
    # search for https.request or gemini url
    idx2 = c.find('generativelanguage.googleapis.com')
    print('Found API endpoint at', idx2)
    print(c[idx2-100:idx2+1500])
