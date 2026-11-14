const fs = require('fs');
const path = require('path');

function getJsonPath(filename) {
  const possible = [
    path.join(process.cwd(), filename),
    path.join(process.cwd(), 'public', filename),
    path.join(__dirname, filename),
    path.join(__dirname, '..', filename),
    path.join(__dirname, '..', 'public', filename)
  ];
  for (const p of possible) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

console.log('rani_customers path:', getJsonPath('rani_customers.json'));
console.log('rani_orders path:', getJsonPath('rani_orders.json'));
