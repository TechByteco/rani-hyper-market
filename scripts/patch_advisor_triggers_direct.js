const fs = require('fs');

let code = fs.readFileSync('generativeAiAdvisor.js', 'utf8');

const target = `  // Top Customers / VIPs
  if (q.includes('top customer') || q.includes('vip customer') || q.includes('who bought most') || q.includes('highest spending customer') || q.includes('top customers')) {
    return as.getTopCustomersReport(10);
  }`;

const replacement = `  // Recent Orders & Live Counter Dispatches
  if (q.includes('recent order') || q.includes('counter dispatch') || q.includes('live counter') || q.includes('latest dispatch') || q.includes('recent bills') || q.includes('latest orders') || q.includes('dispatch status') || q.includes('counter sales') || q.includes('dispatches')) {
    return as.getRecentDispatchesReport(10);
  }

  // Top Customers / VIPs
  if (q.includes('top customer') || q.includes('vip customer') || q.includes('who bought most') || q.includes('highest spending customer') || q.includes('top customers') || q.includes('top 10 customer') || q.includes('highest purchasing') || q.includes('top purchasers') || q.includes('top purchasing') || q.includes('best customer') || q.includes('vip patron') || q.includes('who is our highest') || q.includes('highest purchaser')) {
    return as.getTopCustomersReport(10);
  }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('generativeAiAdvisor.js', code, 'utf8');
  console.log('Successfully replaced Top Customers & Recent Dispatches triggers in generativeAiAdvisor.js!');
} else {
  console.log('Target not found in generativeAiAdvisor.js');
}
