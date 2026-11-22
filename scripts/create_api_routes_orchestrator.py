import os

print("=== CREATING SERVERLESS WRAPPERS FOR DISPATCHER & RL ===")

wrapper_code = """const handler = require('../index.js');

module.exports = (req, res) => {
  return handler(req, res);
};
"""

routes = [
    'api/dispatcher/dispatch.js',
    'api/rl/bandit-status.js',
    'api/rl/optimize-step.js',
    'api/rl/orchestrate-loop.js',
    'api/telemetry/record.js'
]

for r in routes:
    os.makedirs(os.path.dirname(r), exist_ok=True)
    with open(r, 'w', encoding='utf-8') as f:
        f.write(wrapper_code)
    print(f"Created {r}")
