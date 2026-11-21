const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

const csl = html.indexOf('AdminDataCopilot.copyStockList =');
console.log(html.substring(csl + 500, csl + 1200));
