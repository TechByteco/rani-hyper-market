const fs = require('fs');
if (fs.existsSync('ai-config.json')) {
  console.log('ai-config.json:', fs.readFileSync('ai-config.json', 'utf8'));
} else {
  console.log('ai-config.json does not exist');
}
