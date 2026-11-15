const https = require('https');

const SUPABASE_URL = 'https://lofykatlypiywrziwtdp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8-vFFctJnZYUTZFCmV2rqg_LgHuYjrn';

function pingSupabase() {
  return new Promise((resolve) => {
    // Ping genuine database table (store_admins) to actively exercise PostgreSQL engine and prevent sleep
    const url = `${SUPABASE_URL}/rest/v1/store_admins?select=username&limit=1`;
    console.log(`[Supabase Keepalive] Pinging ${url}...`);

    const req = https.get(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'User-Agent': 'SKS-Market-Keepalive/1.0'
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[Supabase Keepalive] HTTP Status: ${res.statusCode}`);
        resolve({
          status: res.statusCode === 200 ? 'online' : (res.statusCode < 500 ? 'online' : 'degraded'),
          httpCode: res.statusCode,
          active: res.statusCode < 500,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('[Supabase Keepalive] Ping request timed out (5s)');
      resolve({
        status: 'timeout',
        active: false,
        timestamp: new Date().toISOString()
      });
    });

    req.on('error', (err) => {
      console.warn(`[Supabase Keepalive] Ping failed: ${err.message}`);
      resolve({
        status: 'error',
        error: err.message,
        active: false,
        paused: err.code === 'ENOTFOUND',
        timestamp: new Date().toISOString()
      });
    });
  });
}

if (require.main === module) {
  pingSupabase().then(res => {
    console.log('[Supabase Keepalive] Result:', JSON.stringify(res, null, 2));
    if (res.paused) {
      console.log('\n======================================================');
      console.log('NOTICE: Supabase project lofykatlypiywrziwtdp is currently PAUSED on free-tier.');
      console.log('To unpause: Login to https://supabase.com/dashboard and click "Restore project".');
      console.log('Once restored, our GitHub Action and Vercel keep-alive cron will keep it active permanently!');
      console.log('======================================================\n');
    }
  });
}

module.exports = { pingSupabase };
