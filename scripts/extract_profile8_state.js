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
        (async () => {
          const out = {
            localStorage: {},
            holdDB: null,
            databases: await indexedDB.databases()
          };
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            out.localStorage[k] = localStorage.getItem(k);
          }
          // Try opening RaniImageHoldDB_v1
          try {
            await new Promise((resolve) => {
              const req = indexedDB.open('RaniImageHoldDB_v1', 1);
              req.onsuccess = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('custom_state')) return resolve();
                const tx = db.transaction('custom_state', 'readonly');
                const store = tx.objectStore('custom_state');
                const getReq = store.get('bundle');
                getReq.onsuccess = () => {
                  out.holdDB = getReq.result;
                  resolve();
                };
                getReq.onerror = () => resolve();
              };
              req.onerror = () => resolve();
            });
          } catch(e) {}
          return out;
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

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const val = msg.result?.result?.value;
      console.log('Databases:', val?.databases);
      console.log('Hold DB:', val?.holdDB);
      console.log('LocalStorage keys:', Object.keys(val?.localStorage || {}));
      fs.writeFileSync('scripts/extracted_profile8_state.json', JSON.stringify(val, null, 2));
      ws.close();
      chromeProc.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error('Error:', e);
    chromeProc.kill();
  }
}, 4000);
