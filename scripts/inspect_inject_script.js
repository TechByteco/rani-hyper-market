const fs = require('fs');

const p = 'scripts/inject_festival_copilot.py';
if (fs.existsSync(p)) {
  console.log(fs.readFileSync(p, 'utf8'));
}
