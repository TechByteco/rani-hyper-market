const fs = require('fs');

const content = fs.readFileSync('festivalMasterData.js', 'utf8');

// evaluate or inspect FESTIVAL_MASTER
// Since it's node module or browser, let's load it
let FESTIVAL_MASTER;
try {
  const mod = require('./festivalMasterData.js');
  FESTIVAL_MASTER = mod.FESTIVAL_MASTER || mod;
} catch (e) {
  console.log('Require failed:', e.message);
}

if (!FESTIVAL_MASTER) {
  // Let's eval safe
  const fn = new Function('module', 'exports', content + '; return FESTIVAL_MASTER;');
  const m = { exports: {} };
  FESTIVAL_MASTER = fn(m, m.exports);
}

console.log('Loaded FESTIVAL_MASTER count:', FESTIVAL_MASTER.length);
console.log('First entry sample:');
console.log(JSON.stringify(FESTIVAL_MASTER[0], null, 2));

console.log('\nSample festival IDs and their datesByYear:');
FESTIVAL_MASTER.forEach((f, i) => {
  console.log(`${i+1}. [${f.id}] ${f.name}`);
  console.log(`   datesByYear:`, JSON.stringify(f.datesByYear));
  console.log(`   cutoff2026: ${f.cutoff2026}, date2026: ${f.date2026 || (f.datesByYear && f.datesByYear['2026'])}`);
});
