const fs = require('fs');
const AdminDataCopilot = {
  formatCompactInr: (n) => '₹' + n
};
function escapeAiHtml(s) { return s || ''; }

eval(fs.readFileSync('scripts/generated_festival_copilot.js', 'utf8'));

console.log('handleFestivalAnalytics type:', typeof AdminDataCopilot.handleFestivalAnalytics);
const res = AdminDataCopilot.handleFestivalAnalytics('thai pongal festival stock need');
console.log('Result HTML length:', res.length);
console.log('Contains Thai Pongal:', res.includes('Thai Pongal'));
console.log('Contains 141,312:', res.includes('141,312'));
console.log('Contains copyStockList:', res.includes('copyStockList'));
