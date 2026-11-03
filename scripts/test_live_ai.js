const https = require('https');

const tests = [
  { method: 'GET', path: '/api/ai-analytics/overview?fy=2026-2027', name: 'AI Overview' },
  { method: 'GET', path: '/api/ai/live-pulse', name: 'Live Pulse' },
  { method: 'GET', path: '/api/ai-analytics/forecast?days=14', name: 'AI Forecast' },
  { method: 'GET', path: '/api/ai/festival-predictions', name: 'Festival Predictions' },
  { method: 'GET', path: '/api/ai/world-trade-predictions', name: 'World Trade Predictions' },
  { method: 'GET', path: '/api/ai/config', name: 'AI Config' },
  { method: 'GET', path: '/api/ai/whatsapp-briefing', name: 'WhatsApp Briefing' },
  { method: 'GET', path: '/api/markbot/status', name: 'MarkBot Status' },
  { method: 'GET', path: '/api/markbot/insights', name: 'MarkBot Insights' },
  { 
    method: 'POST', 
    path: '/api/ai-analytics/chat', 
    body: JSON.stringify({ question: 'What are the top selling items this month?' }),
    name: 'AI Chat Endpoint' 
  }
];

function runTest(t) {
  return new Promise(resolve => {
    const url = 'https://rani-hyper-market.vercel.app' + t.path;
    const req = https.request(url, {
      method: t.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch(e) {}
        resolve({
          name: t.name,
          status: res.statusCode,
          isJson: !!parsed,
          preview: parsed ? JSON.stringify(parsed).slice(0, 120) : data.slice(0, 120)
        });
      });
    });
    req.on('error', err => resolve({ name: t.name, status: 0, error: err.message }));
    if (t.body) req.write(t.body);
    req.end();
  });
}

async function main() {
  console.log('Testing live AI endpoints on https://rani-hyper-market.vercel.app...\n');
  for (const t of tests) {
    const res = await runTest(t);
    const mark = res.status === 200 ? '✅' : '❌';
    console.log(`${mark} [${res.status}] ${res.name}: ${res.preview || res.error}`);
  }
}

main();
