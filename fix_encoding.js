const fs = require('fs');
const path = require('path');

const win1252Map = {};
for (let i = 0; i < 256; i++) {
  if (i < 0x80 || i >= 0xA0) win1252Map[String.fromCharCode(i)] = i;
}
const extra = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
  0x8B: 0x2039, 0x8C: 0x0152, 0x8D: 0x008D, 0x8E: 0x017D, 0x8F: 0x008F,
  0x90: 0x0090, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D,
  0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC, 0x99: 0x2122,
  0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9D: 0x009D, 0x9E: 0x017E, 0x9F: 0x0178
};
for (const [byteVal, uni] of Object.entries(extra)) {
  win1252Map[String.fromCharCode(uni)] = Number(byteVal);
}

function decodeMojibake(str) {
  // Regex to match sequences of characters that were created from multi-byte UTF-8 sequences interpreted as win-1252:
  const regex = /[\xC2-\xF4][\x80-\xBF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]{1,3}/g;

  return str.replace(regex, (match) => {
    let bytes = [];
    for (let ch of match) {
      if (win1252Map[ch] !== undefined) {
        bytes.push(win1252Map[ch]);
      } else {
        return match;
      }
    }
    try {
      let decoded = Buffer.from(bytes).toString('utf8');
      if (!decoded.includes('\uFFFD')) {
        return decoded;
      }
    } catch (e) {}
    return match;
  });
}

// Test on files
const files = ['admin.html', 'store.html', 'index.html', 'login.html'];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = decodeMojibake(content);

  // Extra direct cleanups if any missed
  fixed = fixed
    .replace(/â‚¹/g, '₹')
    .replace(/â€”/g, '—')
    .replace(/âš¡/g, '⚡')
    .replace(/âœ…/g, '✅')
    .replace(/âŒ/g, '❌')
    .replace(/â­/g, '⭐')
    .replace(/ðŸ“ /g, '📍')
    .replace(/ðŸ’µ/g, '💵')
    .replace(/ðŸŽ‰/g, '🎉')
    .replace(/ðŸŒ¿/g, '🌿')
    .replace(/ðŸ‘‹/g, '👋')
    .replace(/ðŸ“Š/g, '📊')
    .replace(/ðŸ‘¤/g, '👤')
    .replace(/ðŸ¢/g, '🏢')
    .replace(/ðŸ”/g, '🔍')
    .replace(/ðŸ›’/g, '🛒')
    .replace(/â”€/g, '─');

  // Check if modified
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`Successfully fixed encoding in: ${file}`);
  } else {
    console.log(`No encoding changes needed in: ${file}`);
  }
}
