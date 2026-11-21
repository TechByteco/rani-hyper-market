const fs = require('fs');
if (fs.existsSync('scripts/generated_festival_copilot.js')) {
  console.log(fs.readFileSync('scripts/generated_festival_copilot.js', 'utf8').substring(0, 1500));
}
