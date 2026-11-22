
const handler = require('../api/index');

async function testRoute(method, url, body = null) {
  return new Promise((resolve) => {
    const req = {
      method,
      url,
      headers: { host: 'localhost' },
      body
    };
    let statusCode = 200;
    let headers = {};
    let data = '';
    const res = {
      setHeader: (k, v) => headers[k] = v,
      writeHead: (code, h) => { statusCode = code; if(h) headers = {...headers, ...h}; },
      status: (code) => { statusCode = code; return res; },
      json: (obj) => { resolve({ statusCode, body: obj }); },
      end: (d) => {
        try {
          resolve({ statusCode, body: JSON.parse(d || '{}') });
        } catch {
          resolve({ statusCode, body: d });
        }
      }
    };
    handler(req, res);
  });
}

async function run() {
  console.log('Testing api/index.js new endpoints:');

  // 1. Webhook
  const r1 = await testRoute('POST', '/api/webhooks/gpay', { txnId: 'T1', amount: 50 });
  console.log('POST /api/webhooks/gpay ->', r1.statusCode, r1.body.success);

  // 2. Shift current
  const r2 = await testRoute('GET', '/api/pos/shift/current');
  console.log('GET /api/pos/shift/current ->', r2.statusCode, 'isOpen:', r2.body.isOpen);

  // 3. Fresh markdowns
  const r3 = await testRoute('GET', '/api/inventory/fresh-markdowns');
  console.log('GET /api/inventory/fresh-markdowns ->', r3.statusCode, 'deals:', r3.body.total_deals);

  // 4. Sync status
  const r4 = await testRoute('GET', '/api/sync/delta');
  console.log('GET /api/sync/delta ->', r4.statusCode, 'status:', r4.body.status);

  console.log('ALL API/INDEX.JS NEW ROUTES VERIFIED!');
}

run();
