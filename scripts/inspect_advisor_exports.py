with open('generativeAiAdvisor.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'module.exports ='
idx = c.find(target)
print('Target index in generativeAiAdvisor.js:', idx)
print(c[idx:idx+500])
