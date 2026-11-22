import json

with open('tamil_regional_voice_config.json', 'r', encoding='utf-8') as f:
    cfg = json.load(f)

print("Loaded tamil_regional_voice_config.json successfully.")
print("Templates available:", list(cfg['dynamic_daypart_and_calendar_templates'].keys()))
print("Cultural dictionary keys:", list(cfg['regional_cultural_dictionary'].keys()))
print("Banned terms:", [t['banned'] for t in cfg['regional_cultural_dictionary']['dialect_vocabulary_rules']['prohibited_corporate_terms']])
