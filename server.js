const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const analytics = require('./analyticsService');

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0].split('#')[0];
  const queryStr = req.url.includes('?') ? req.url.split('?')[1] : '';
  const queryParams = new URLSearchParams(queryStr);

  // API Endpoints: Live Desktop POS Bridge
  if (reqPath === '/api/pos/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getPosStatus()));
    return;
  }

  if (reqPath === '/api/pos/orders') {
    const limit = parseInt(queryParams.get('limit') || '100', 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getLivePosOrders(limit)));
    return;
  }

  if (reqPath === '/api/pos/products') {
    const search = queryParams.get('search') || '';
    const limit = parseInt(queryParams.get('limit') || '100', 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getLivePosProducts(search, limit)));
    return;
  }

  if (reqPath === '/api/pos/sync' && req.method === 'POST') {
    analytics.syncAllToWebAndCloud()
      .then(result => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  if (reqPath === '/api/pos/save-sale' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const saleData = JSON.parse(body || '{}');
        const result = analytics.saveNewSale(saleData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/api/pos/launch') {
    const { exec } = require('child_process');
    const appDir = 'C:\\SKS Market\\app';
    const exeName = fs.existsSync(path.join(appDir, 'SNS Market.exe')) ? 'SNS Market.exe' : 'SKS Market.exe';
    const exePath = path.join(appDir, exeName);

    try {
      exec(`start "" /d "${appDir}" "${exeName}"`, (err) => {
        if (err) console.warn('Desktop launch notice:', err.message);
      });
    } catch (e) {
      console.warn('Desktop launch error:', e.message);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Launched SNS Market POS',
      webUrl: '/rani.html?page=counterSale',
      desktopExe: exePath
    }));
    return;
  }

  // API Endpoints: Personal AI Analytics
  if (reqPath === '/api/ai-analytics/overview') {
    const fy = queryParams.get('fy') || '2026-2027';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getOverview(fy)));
    return;
  }

  if (reqPath === '/api/ai-analytics/daily') {
    const fy = queryParams.get('fy') || '2026-2027';
    const limit = parseInt(queryParams.get('limit') || '30', 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getDailyTrends(limit, fy)));
    return;
  }

  if (reqPath === '/api/ai-analytics/monthly') {
    const fy = queryParams.get('fy') || '2026-2027';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getMonthlyTrends(fy)));
    return;
  }

  if (reqPath === '/api/ai-analytics/yearly') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getYearlyTrends()));
    return;
  }

  if (reqPath === '/api/ai/financial-years') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getFinancialYearsList()));
    return;
  }

  if (reqPath === '/api/ai-analytics/hourly') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getHourlyTrends()));
    return;
  }

  if (reqPath === '/api/ai-analytics/forecast' || reqPath === '/api/ai/forecast') {
    const days = parseInt(queryParams.get('days') || '14', 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getForecast(days)));
    return;
  }

  if (reqPath === '/api/ai/festival-predictions' || reqPath === '/api/ai-analytics/festivals') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getFestivalPredictions()));
    return;
  }

  if (reqPath === '/api/ai/world-trade-predictions' || reqPath === '/api/ai-analytics/world-trade') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getWorldTradePredictions()));
    return;
  }

  if (reqPath === '/api/ai/live-pulse' || reqPath === '/api/ai-analytics/live-pulse') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getLivePulse()));
    return;
  }

  if (reqPath === '/api/ai/festival-stock-needs' || reqPath === '/api/ai/historical-festival-sales') {
    const festivalId = queryParams.get('festivalId') || queryParams.get('id') || null;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getHistoricalFestivalAnalysis(festivalId)));
    return;
  }

  if (reqPath === '/api/ai/festival-calendar-matrix') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getFestivalCalendarMatrix()));
    return;
  }

  if (reqPath === '/api/ai-analytics/dead-stock') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getDeadStock(15)));
    return;
  }

  if (reqPath === '/api/ai-analytics/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const questionText = parsed.question || parsed.prompt || parsed.query || '';
        const answer = await analytics.answerAiAdvisor(questionText, parsed.fy || '2026-2027', parsed.history || []);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(answer));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // AI Configuration Endpoint
  if (reqPath === '/api/ai/config') {
    const generativeAi = require('./generativeAiAdvisor');
    if (req.method === 'GET') {
      const cfg = generativeAi.loadConfig();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        enabled: cfg.enabled,
        model: cfg.model,
        hasKey: !!cfg.geminiApiKey,
        keyMasked: cfg.geminiApiKey ? cfg.geminiApiKey.slice(0, 4) + '...' + cfg.geminiApiKey.slice(-4) : '',
        useCloudIfAvailable: cfg.useCloudIfAvailable,
        activeEngine: cfg.geminiApiKey && cfg.useCloudIfAvailable ? 'Google Gemini Cloud AI' : 'SNS Autonomous Retail Engine (Local)'
      }));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const updated = generativeAi.saveConfig(parsed);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            activeEngine: updated.geminiApiKey && updated.useCloudIfAvailable ? 'Google Gemini Cloud AI' : 'SNS Autonomous Retail Engine (Local)' 
          }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // API Endpoints: WhatsApp Automated Briefing
  if (reqPath === '/api/ai/whatsapp-briefing') {
    const text = analytics.getWhatsAppBriefingText();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      text: text,
      ownerName: 'Rani (Shop Owner)',
      defaultPhone: '917708834547',
      formattedPhone: '+91 77088 34547',
      secondaryPhone: '918807334547',
      formattedSecondary: '+91 88073 34547'
    }));
    return;
  }

  if (reqPath === '/api/ai/send-whatsapp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        let rawPhone = parsed.phone || '7708834547';
        let cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
        if (cleanPhone.length === 10) {
          cleanPhone = '91' + cleanPhone;
        } else if (cleanPhone.startsWith('0')) {
          cleanPhone = '91' + cleanPhone.substring(1);
        }
        
        let message = parsed.message || analytics.getWhatsAppBriefingText();
        const encoded = encodeURIComponent(message);
        const waUri = `whatsapp://send?phone=${cleanPhone}&text=${encoded}`;
        const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
        const apiUri = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;

        // Launch WhatsApp Desktop via Windows protocol handler
        const { exec } = require('child_process');
        exec(`powershell -NoProfile -Command "Start-Process '${waUri}'"`, (err) => {
          if (err) console.error('WhatsApp Desktop launch error:', err.message);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          phone: cleanPhone,
          formattedPhone: '+' + cleanPhone,
          recipient: 'Rani (Shop Owner)',
          waUri: waUri,
          webUrl: webUrl,
          apiUri: apiUri,
          briefing: message,
          message: 'Automated briefing connected to WhatsApp for shop owner!'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/api/rani/backup-info') {
    const fetchDir = 'G:/dell intel core i7 pc data/SKS new fetchable';
    const zipName = 'Full Backup RANI HYPER MARKET on 12-Sep-2026.zip';
    const zipPath = path.join(fetchDir, zipName);
    let zipStats = null;

    if (fs.existsSync(zipPath)) {
      const s = fs.statSync(zipPath);
      zipStats = {
        name: zipName,
        sizeBytes: s.size,
        sizeMb: (s.size / (1024 * 1024)).toFixed(2) + ' MB',
        modified: s.mtime.toLocaleString(),
        path: zipPath,
        exists: true
      };
    } else {
      zipStats = { exists: false, note: 'Backup zip not found at path' };
    }

    const dbPath = path.join(fetchDir, 'SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db');
    const dbExists = fs.existsSync(dbPath);

    let profile = null;
    try {
      profile = JSON.parse(fs.readFileSync(path.join(__dirname, 'rani_store_profile.json'), 'utf8'));
    } catch(e) {}

    let analytics = null;
    try {
      analytics = JSON.parse(fs.readFileSync(path.join(__dirname, 'rani_analytics.json'), 'utf8'));
    } catch(e) {}

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      store: 'RANI HYPER MARKET',
      username: 'rani',
      backup: zipStats,
      activeDatabase: {
        file: '9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db',
        financialYear: '2026-2027',
        directory: fetchDir,
        exists: dbExists
      },
      stats: analytics ? {
        totalOrders: analytics.totalOrders,
        totalSales: analytics.totalSales,
        productsCount: (function() {
          try {
            return JSON.parse(fs.readFileSync(path.join(__dirname, 'rani_products.json'), 'utf8')).length;
          } catch(e) { return 7179; }
        })(),
        customersCount: 323
      } : null
    }));
    return;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const cleanPath = decodeURIComponent(reqPath);
  let filePath = path.join(__dirname, cleanPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath)) {
    const pubPath = path.join(__dirname, 'public', cleanPath);
    if (fs.existsSync(pubPath)) {
      filePath = pubPath;
    } else if (fs.existsSync(pubPath + '.html')) {
      filePath = pubPath + '.html';
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 
        'Content-Type': MIME[ext] || 'text/plain'
      });
      res.end(content);
    }
  });
});

process.on('uncaughtException', (err) => {
  console.error('[SERVER ERROR] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER ERROR] Unhandled Rejection:', reason);
});

server.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }

  console.log('\n======================================================');
  console.log(`  Rani Hyper Market / NSN SaaS Local Server Running!`);
  console.log(`  Local PC:      http://localhost:${PORT}/admin.html`);
  ips.forEach(ip => {
    console.log(`  Phone / Wi-Fi: http://${ip}:${PORT}/admin.html`);
    console.log(`                 http://${ip}:${PORT}/store.html`);
  });
  console.log('======================================================\n');
});

