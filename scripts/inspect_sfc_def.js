const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

const sfc = html.indexOf('AdminDataCopilot.switchFestivalCard =');
console.log('Definition at:', sfc);
if (sfc !== -1) {
  console.log(html.substring(sfc, sfc + 500));
}
