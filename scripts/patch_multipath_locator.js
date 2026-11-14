const fs = require('fs');

let code = fs.readFileSync('analyticsService.js', 'utf8');

// Replace custFile and ordersFile resolution in analyticsService.js
const helper = `function findLocalDataFile(filename) {
  const possible = [
    path.join(__dirname, filename),
    path.join(__dirname, 'public', filename),
    path.join(process.cwd(), filename),
    path.join(process.cwd(), 'public', filename),
    path.join(__dirname, '..', filename),
    path.join(__dirname, '..', 'public', filename)
  ];
  for (const p of possible) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}
`;

if (!code.includes('function findLocalDataFile(')) {
  code = helper + '\n' + code;
}

code = code.replace(
  "const custFile = path.join(__dirname, 'rani_customers.json');",
  "const custFile = findLocalDataFile('rani_customers.json');"
);

code = code.replace(
  "const ordersFile = path.join(__dirname, 'rani_orders.json');",
  "const ordersFile = findLocalDataFile('rani_orders.json');"
);

fs.writeFileSync('analyticsService.js', code, 'utf8');
console.log('Successfully updated analyticsService.js with robust multi-path data locator!');
