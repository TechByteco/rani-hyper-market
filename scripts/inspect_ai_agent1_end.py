with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = 'agent1-miner-section'
idx = c.find(target)
print('Target index in ai-analytics.html:', idx)
# find end of agent1-miner-section
target_end = '<!-- LOCAL FESTIVAL DEMAND FORECASTER & EVENT PULSE -->'
idx_end = c.find(target_end)
print('End of section at:', idx_end)
