import re

print("=== WIRING vernacularCopywriterService INTO generativeAiAdvisor.js ===")

with open('generativeAiAdvisor.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Add require at top
if "vernacularCopywriterService" not in c:
    top_req = "const vernacularCopywriterService = require('./services/vernacularCopywriterService');\n"
    c = top_req + c
    print("Added require('./services/vernacularCopywriterService') to generativeAiAdvisor.js")

# Add export
if "generateVernacularCampaign," not in c:
    c = c.replace("generateMarketingCampaign,", "generateMarketingCampaign,\n  generateVernacularCampaign: vernacularCopywriterService.generateVernacularCampaign,")
    print("Added generateVernacularCampaign to module.exports")

with open('generativeAiAdvisor.js', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated generativeAiAdvisor.js successfully.")
