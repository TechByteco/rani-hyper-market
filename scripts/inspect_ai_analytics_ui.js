const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

// Find festival sections
const matches = [];
let pos = 0;
while ((pos = html.indexOf('festival', pos)) !== -1) {
  matches.push(pos);
  pos += 8;
}
console.log('Total occurrences of "festival" in ai-analytics.html:', matches.length);

// Let's find fest-stock or similar IDs
const ids = html.match(/id=["'][^"']*fest[^"']*["']/gi) || [];
console.log('Festival-related IDs:', ids);

// Look around #fest-stock-section or loadFestivalNeeds
const lfn = html.indexOf('loadFestivalNeeds') !== -1 ? html.indexOf('loadFestivalNeeds') : html.indexOf('festival-stock-needs');
console.log('loadFestivalNeeds / festival-stock-needs at:', lfn);
if (lfn !== -1) {
  console.log(html.substring(lfn - 200, lfn + 2500));
}
