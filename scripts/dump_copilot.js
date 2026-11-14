const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

const sIdx = html.indexOf('id="module-sec-ai-copilot"');
const mainEnd = html.indexOf('</main>', sIdx);
console.log('Total module-sec-ai-copilot length:', mainEnd - sIdx);

// Write current copilot HTML to a file so we can inspect it completely
fs.writeFileSync('scripts/current_copilot_html.html', html.substring(sIdx, mainEnd));
console.log('Written scripts/current_copilot_html.html');
