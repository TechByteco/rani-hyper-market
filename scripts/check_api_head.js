const fs = require('fs');
const code = fs.readFileSync('api/index.js', 'utf8');
console.log(code.substring(0, 1000));
