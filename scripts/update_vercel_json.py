import json

with open('vercel.json', 'r', encoding='utf-8') as f:
    v = json.load(f)

v['functions']['api/**/*.js']['includeFiles'] = "{public/**,data/**,*.json,posEnhancementService.js,analyticsService.js,generativeAiAdvisor.js,aiProductImageEngine.js,festivalMasterData.js,hypermarketBackend.js}"

with open('vercel.json', 'w', encoding='utf-8') as f:
    json.dump(v, f, indent=2)

print("Updated vercel.json successfully!")
