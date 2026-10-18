const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_DATA = 'C:\\temp\\chrome_extract';

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  '--user-data-dir=' + TEMP_DATA,
  '--remote-debugging-port=9225',
  '--disable-gpu',
  '--no-sandbox',
  'https://rani-hyper-market.vercel.app/store.html'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9225/json', r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const target = list.find(t => t.url.includes('rani-hyper-market.vercel.app'));
    console.log('Using target:', target?.title, target?.url);
    if (!target) {
      chromeProc.kill();
      return;
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = () => {
      const expr = `
        new Promise((resolve, reject) => {
          const req = indexedDB.open('RaniStoreCatalogDB_v1', 1);
          req.onsuccess = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('catalog')) {
              return resolve({ error: 'catalog store not found', stores: Array.from(db.objectStoreNames) });
            }
            const tx = db.transaction('catalog', 'readonly');
            const store = tx.objectStore('catalog');
            const getReq = store.get('products');
            getReq.onsuccess = () => {
              resolve(getReq.result);
            };
            getReq.onerror = () => reject(getReq.error);
          };
          req.onerror = () => reject(req.error);
        })
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

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log('Got response from Chrome!');
      const val = msg.result?.result?.value;
      if (val && val.data) {
        console.log('Total products in RaniStoreCatalogDB_v1:', val.data.length);
        fs.writeFileSync('scripts/extracted_catalog_profile8.json', JSON.stringify(val.data, null, 2));
        console.log('SUCCESSFULLY WROTE scripts/extracted_catalog_profile8.json!');
      } else {
        console.log('Value received:', JSON.stringify(val).slice(0, 300));
      }
      ws.close();
      chromeProc.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error('Error:', e);
    chromeProc.kill();
  }
}, 4000);
