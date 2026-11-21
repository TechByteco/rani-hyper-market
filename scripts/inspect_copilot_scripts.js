const fs = require('fs');

if (fs.existsSync('scripts/generate_festival_copilot.py')) {
  console.log('generate_festival_copilot.py:');
  console.log(fs.readFileSync('scripts/generate_festival_copilot.py', 'utf8').substring(0, 1500));
}

if (fs.existsSync('scripts/inject_festival_copilot.py')) {
  console.log('\ninject_festival_copilot.py:');
  console.log(fs.readFileSync('scripts/inject_festival_copilot.py', 'utf8').substring(0, 1500));
}
