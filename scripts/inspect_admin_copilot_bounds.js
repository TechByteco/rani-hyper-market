const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

const sIdx = html.indexOf('/* LUNISOLAR FESTIVALS EMPIRICAL DATABASE');
console.log('Start index of copilot festival block in admin.html:', sIdx);
if (sIdx !== -1) {
  const eIdx = html.indexOf('AdminDataCopilot.switchFestivalCard', sIdx);
  console.log('switchFestivalCard at:', eIdx);
  if (eIdx !== -1) {
    const endBlock = html.indexOf('};', eIdx);
    console.log('End of block at:', endBlock + 2);
    console.log('Snippet at end:');
    console.log(html.substring(endBlock - 100, endBlock + 50));
  }
}
