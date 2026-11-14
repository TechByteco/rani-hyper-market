const fs = require('fs');

function searchStr(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = dir + '/' + f;
    if (f.endsWith('.js') && !f.includes('node_modules')) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.includes('Analysis & Strategic Perspective for')) {
        console.log('Found in:', p);
      }
    }
  }
}

searchStr('.');
searchStr('api');
