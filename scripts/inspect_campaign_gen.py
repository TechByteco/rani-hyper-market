with open('generativeAiAdvisor.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'generateMarketingCampaign'
idx = c.find(target)
print(c[idx+1800:idx+4500])
