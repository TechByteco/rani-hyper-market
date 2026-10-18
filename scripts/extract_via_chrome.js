const { execFile, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data';
const TEMP_DATA = 'C:\\temp\\chrome_extract';

async function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch(e) {}
    }
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function extractFromProfile(profileName) {
  console.log(`\n========================================`);
  console.log(`STARTING CHROME EXTRACTION FOR ${profileName}`);
  console.log(`========================================`);

  if (fs.existsSync(TEMP_DATA)) {
    try { fs.rmSync(TEMP_DATA, { recursive: true, force: true }); } catch(e) {}
  }
  fs.mkdirSync(path.join(TEMP_DATA, 'Default'), { recursive: true });

  // Copy Local State
  const localStateSrc = path.join(USER_DATA, 'Local State');
  if (fs.existsSync(localStateSrc)) {
    try { fs.copyFileSync(localStateSrc, path.join(TEMP_DATA, 'Local State')); } catch(e) {}
  }

  // Copy Profile files: Local Storage and IndexedDB
  const profileSrc = path.join(USER_DATA, profileName);
  const destDefault = path.join(TEMP_DATA, 'Default');

  const lsSrc = path.join(profileSrc, 'Local Storage');
  if (fs.existsSync(lsSrc)) {
    console.log('Copying Local Storage...');
    await copyDir(lsSrc, path.join(destDefault, 'Local Storage'));
  }

  const idbSrc = path.join(profileSrc, 'IndexedDB');
  if (fs.existsSync(idbSrc)) {
    console.log('Copying IndexedDB...');
    await copyDir(idbSrc, path.join(destDefault, 'IndexedDB'));
  }

  // Launch headless Chrome on port 9222
  console.log('Launching Headless Chrome on port 9222...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--user-data-dir=${TEMP_DATA}`,
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--enable-features=NetworkService,NetworkServiceInProcess',
    'https://rani-hyper-market.vercel.app/store.html'
  ], { detached: true, stdio: 'ignore' });

  // Wait for 9222 to be available
  let target = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const list = await fetchJson('http://127.0.0.1:9222/json');
      console.log('Chrome tabs open:', list.length);
      target = list.find(t => t.url.includes('rani-hyper-market'));
      if (target) break;
    } catch(e) {}
  }

  if (!target) {
    console.error('Failed to connect to Chrome page target!');
    chromeProc.kill();
    return null;
  }

  console.log('Target found:', target.url, target.webSocketDebuggerUrl);

  // Connect WebSocket to evaluate
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  const result = await new Promise((resolve, reject) => {
    ws.onopen = () => {
      console.log('WebSocket connected to Chrome page. Evaluating extraction script...');
      const expr = `
        (async () => {
          // Wait 2.5 seconds for scripts to boot and indexeddb to open
          await new Promise(r => setTimeout(r, 2500));
          const ls_images = localStorage.getItem('nsn_custom_images');
          const ls_cats = localStorage.getItem('nsn_custom_categories');
          let holdState = null;
          let catalog = null;
          try {
            if (window.RaniImageHoldEngine) {
              holdState = await window.RaniImageHoldEngine.getHoldState();
            }
          } catch(e) {}
          try {
            if (window.RaniCatalogDB) {
              catalog = await window.RaniCatalogDB.getCatalog();
            }
          } catch(e) {}

          return {
            ls_images: ls_images ? JSON.parse(ls_images) : null,
            ls_cats: ls_cats ? JSON.parse(ls_cats) : null,
            holdState: holdState,
            catalogLength: catalog ? catalog.length : 0,
            catalogWithImages: catalog ? catalog.filter(p => p.image_url || p.image).map(p => ({
              id: p.id,
              title: p.title,
              barcode: p.barcode,
              image_url: p.image_url,
              image: p.image,
              category: p.category
            })) : null
          };
        })()
      `;
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: expr,
          awaitPromise: true,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          resolve(msg.result?.result?.value);
        }
      } catch(e) { reject(e); }
    };

    ws.onerror = reject;
  });

  ws.close();
  chromeProc.kill();
  return result;
}

(async () => {
  const profile8Result = await extractFromProfile('Profile 8');
  console.log('\n--- PROFILE 8 EXTRACTION RESULT ---');
  console.log('LS Images:', profile8Result?.ls_images ? Object.keys(profile8Result.ls_images).length : 0);
  console.log('LS Categories:', profile8Result?.ls_cats ? Object.keys(profile8Result.ls_cats).length : 0);
  console.log('Hold State:', profile8Result?.holdState);
  console.log('Catalog Length:', profile8Result?.catalogLength);
  console.log('Catalog with Images:', profile8Result?.catalogWithImages ? profile8Result.catalogWithImages.length : 0);

  fs.writeFileSync('scripts/extracted_profile8_full.json', JSON.stringify(profile8Result, null, 2));
  console.log('Saved to scripts/extracted_profile8_full.json');
})();
