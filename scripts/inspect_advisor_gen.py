with open('generativeAiAdvisor.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'const generativeAiAdvisor ='
if target not in c:
    target = 'generateMarketingCampaign(options = {})'
idx = c.find(target)
print('Target index:', idx)
print(c[idx:idx+1000])
