const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

const cfd = html.indexOf('COPILOT_FESTIVALS_DATA');
console.log('COPILOT_FESTIVALS_DATA in admin.html at:', cfd);
if (cfd !== -1) {
  console.log(html.substring(cfd - 50, cfd + 1200));
}
