const fs = require('fs');
const blob = fs.readFileSync('C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\8');

const targets = [
  'Eno Orange',
  'Anil Semi',
  'Ragi',
  'Chakka Puttu',
  'Samba Whea',
  'Maid',
  'Karthicka',
  'Chik',
  'Gold Winner',
  'Larnier', // Garnier misspelled as Larnier
  'Lifebuoy',
  'Rin',
  'Elite',
  'Vanilla'
];

targets.forEach(t => {
  const p = blob.indexOf(t);
  if (p !== -1) {
    console.log(`\n=== TARGET: "${t}" at ${p} ===`);
    console.log('ASCII:', blob.slice(p - 10, p + 180).toString('latin1').replace(/[^\x20-\x7e]/g, ' '));
    console.log('HEX:  ', blob.slice(p - 10, p + 180).toString('hex'));
  }
});
