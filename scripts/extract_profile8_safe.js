const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_DATA = 'C:\\temp\\chrome_extract';

async function run() {
  console.log('Launching Headless Chrome on port 9226 on about:blank...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--user-data-dir=' + TEMP_DATA,
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9226/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const page = list.find(t => t.type === 'page');
  console.log('Found page target:', page.webSocketDebuggerUrl);

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  console.log('Connected to CDP!');

  // Enable Network and block all external catalog requests so NOTHING can overwrite IndexedDB!
  await send('Network.enable');
  await send('Network.setBlockedURLs', {
    urls: ['*products_catalog.json*', '*rani_products.json*', '*api*']
  });
  console.log('Blocked catalog network requests.');

  // Navigate to https://rani-hyper-market.vercel.app/store.html
  console.log('Navigating to origin...');
  await send('Page.navigate', { url: 'https://rani-hyper-market.vercel.app/store.html' });

  await new Promise(r => setTimeout(r, 2000));

  // Extract catalog from IndexedDB!
  console.log('Querying RaniStoreCatalogDB_v1 from pristine profile...');
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      new Promise((resolve, reject) => {
        const req = indexedDB.open('RaniStoreCatalogDB_v1', 1);
        req.onsuccess = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('catalog')) {
            return resolve({ error: 'catalog store not found' });
          }
          const tx = db.transaction('catalog', 'readonly');
          const store = tx.objectStore('catalog');
          const getReq = store.get('products');
          getReq.onsuccess = () => {
            resolve({
              products: getReq.result?.data || null,
              ls_custom_images: localStorage.getItem('nsn_custom_images'),
              ls_custom_categories: localStorage.getItem('nsn_custom_categories')
            });
          };
          getReq.onerror = () => reject(getReq.error);
        };
        req.onerror = () => reject(req.error);
      })
    `,
    awaitPromise: true,
    returnByValue: true
  });

  const val = evalRes?.result?.value;
  console.log('Result received!');
  console.log('LS custom images:', val?.ls_custom_images);
  console.log('LS custom categories:', val?.ls_custom_categories);
  console.log('Catalog products count:', val?.products ? val.products.length : 0);

  if (val?.products) {
    fs.writeFileSync('scripts/extracted_catalog_pristine_p8.json', JSON.stringify(val.products, null, 2));
    console.log('Successfully saved to scripts/extracted_catalog_pristine_p8.json!');
  }

  ws.close();
  chromeProc.kill();
}

run().catch(console.error);
