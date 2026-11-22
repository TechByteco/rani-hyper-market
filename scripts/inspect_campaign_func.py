with open('generativeAiAdvisor.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'generateMarketingCampaign'
idx = c.find(target)
print('Target index:', idx)
if idx != -1:
    print(c[idx:idx+2000])
