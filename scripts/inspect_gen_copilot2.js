const fs = require('fs');
if (fs.existsSync('scripts/generated_festival_copilot.js')) {
  const code = fs.readFileSync('scripts/generated_festival_copilot.js', 'utf8');
  const hfa = code.indexOf('handleFestivalAnalytics');
  console.log('handleFestivalAnalytics at:', hfa);
  if (hfa !== -1) {
    console.log(code.substring(hfa - 100, hfa + 2000));
  }
}
