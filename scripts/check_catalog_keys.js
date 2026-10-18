const { spawn } = require('child_process');
const http = require('http');

async function checkKeys() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--user-data-dir=C:\\temp\\chrome_extract',
    '--remote-debugging-port=9227',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9227/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({
    id: 1,
    method: 'Page.navigate',
    params: { url: 'https://rani-hyper-market.vercel.app' }
  }));
  await new Promise(r => setTimeout(r, 1500));

  ws.send(JSON.stringify({
    id: 2,
    method: 'Runtime.evaluate',
    params: {
      expression: `
        new Promise((resolve) => {
          const req = indexedDB.open('RaniStoreCatalogDB_v1', 1);
          req.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('catalog', 'readonly');
            const store = tx.objectStore('catalog');
            const keyReq = store.getAllKeys();
            keyReq.onsuccess = () => {
              const keys = keyReq.result;
              Promise.all(keys.map(k => new Promise(res => {
                const getReq = store.get(k);
                getReq.onsuccess = (ev) => {
                  const val = ev.target.result;
                  res({
                    key: k,
                    dataLen: val?.data?.length,
                    firstProduct: val?.data?.[0]
                  });
                };
              }))).then(entries => resolve({ keys, entries }));
            };
          };
        })
      `,
      awaitPromise: true,
      returnByValue: true
    }
  }));

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id === 2) {
      console.log('Result:', JSON.stringify(msg.result?.result?.value, null, 2));
      ws.close();
      chromeProc.kill();
    }
  };
}

checkKeys().catch(console.error);
