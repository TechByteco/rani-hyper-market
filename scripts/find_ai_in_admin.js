const fs = require('fs');
const s = fs.readFileSync('admin.html', 'utf8');
const lines = s.split('\n');
lines.forEach((l, i) => {
  if (l.includes('ai-analytics') || l.includes('AI Studio') || l.includes('Ask AI')) {
    console.log(i + 1, l.trim());
  }
});
