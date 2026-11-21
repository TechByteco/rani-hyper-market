const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'analyticsService.js');
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `      const w26 = windows['2026'] || [];
      const date2026 = w26[1] || '2026-11-08';
      const dObj = new Date(date2026);
      dObj.setDate(dObj.getDate() - 10);
      const cutoff2026 = dObj.toISOString().slice(0, 10);`;

const replacementStr = `      const w26 = windows['2026'] || [];
      let date2026 = w26[1] || '2026-11-08';
      let cutoff2026 = '2026-10-28';
      if (k === 'karthigai_deepam') {
        date2026 = '2026-11-24';
        cutoff2026 = '2026-11-18';
      } else {
        const dObj = new Date(date2026);
        dObj.setDate(dObj.getDate() - 7);
        cutoff2026 = dObj.toISOString().slice(0, 10);
      }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('[OK] Successfully updated analyticsService.js with exact date2026: 2026-11-24 & cutoff: 2026-11-18');
} else {
  // Try CRLF matching
  const targetCRLF = targetStr.replace(/\n/g, '\r\n');
  const replacementCRLF = replacementStr.replace(/\n/g, '\r\n');
  if (code.includes(targetCRLF)) {
    code = code.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('[OK] Successfully updated analyticsService.js (CRLF) with exact date2026: 2026-11-24 & cutoff: 2026-11-18');
  } else {
    console.log('[WARN] target string not found in analyticsService.js');
  }
}
