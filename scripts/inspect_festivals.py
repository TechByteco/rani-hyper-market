import json, re

with open('festivalMasterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse the JSON array from festivalMasterData.js
m = re.search(r'const ALL_YEAR_FESTIVALS = (\[[\s\S]*?\]);\s*(?:module\.exports|if)', text)
if m:
    festivals = json.loads(m.group(1))
    target_ids = ['pongal_harvest', 'deepavali', 'ayudha_pooja', 'chithirai_thiruvizha']
    for f in festivals:
        if f['id'] in target_ids:
            print("="*60)
            print(f"ID: {f['id']} | Name: {f['name']} | Tamil: {f.get('tamilName')}")
            print(f"Surge Multiplier: {f.get('surgeMultiplier')} | Surge Percent: {f.get('surgePercent')}")
            print(f"Categories: {f.get('keyCategories')}")
            print(f"Calendar Rule: {f.get('calendarRule')}")
            print(f"Sample SKUs Count: {len(f.get('sampleSkus', []))}")
            if f.get('sampleSkus'):
                print("First 3 SKUs:")
                for sku in f['sampleSkus'][:3]:
                    print(f"  - {sku.get('name')} | Rate: {sku.get('rate')} | Cost: {sku.get('cost')} | RecOrder: {sku.get('recOrder')}")


