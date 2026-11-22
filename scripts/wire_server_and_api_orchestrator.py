import re

print("=== WIRING AGENT 3 & 4 ENDPOINTS INTO server.js AND api/index.js ===")

server_code = """  // Agent 3 & Agent 4: Omni-Channel Dispatcher & Continuous RL Optimizer Loop
  if (reqPath === '/api/rl/bandit-status' && req.method === 'GET') {
    const orchestrator = require('./services/omniChannelOrchestratorService');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orchestrator.rlOptimizer.getStatus()));
    return;
  }

  if (reqPath === '/api/rl/optimize-step' && (req.method === 'POST' || req.method === 'GET')) {
    const orchestrator = require('./services/omniChannelOrchestratorService');
    const sample = orchestrator.rlOptimizer.sampleArm();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, ...sample }));
    return;
  }

  if (reqPath === '/api/rl/orchestrate-loop' && (req.method === 'POST' || req.method === 'GET')) {
    const orchestrator = require('./services/omniChannelOrchestratorService');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let parsed = {};
        if (req.method === 'POST' && body) {
          try { parsed = JSON.parse(body); } catch(e) { parsed = {}; }
        } else {
          parsed = Object.fromEntries(queryParams.entries());
        }
        const result = await orchestrator.runAutonomousOrchestrationLoop(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/api/dispatcher/dispatch' && req.method === 'POST') {
    const orchestrator = require('./services/omniChannelOrchestratorService');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let parsed = {};
        if (body) {
          try { parsed = JSON.parse(body); } catch(e) { parsed = {}; }
        }
        const [wa, merchant, mqtt] = await Promise.all([
          orchestrator.omniDispatcher.dispatchWhatsAppCloud(parsed),
          orchestrator.omniDispatcher.updateGoogleMerchantFeed(parsed),
          orchestrator.omniDispatcher.publishMqttCounterSignage(parsed)
        ]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, channels: { whatsapp: wa, google_merchant: merchant, mqtt_counter_signage: mqtt } }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/api/telemetry/record' && req.method === 'POST') {
    const orchestrator = require('./services/omniChannelOrchestratorService');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let parsed = {};
        if (body) {
          try { parsed = JSON.parse(body); } catch(e) { parsed = {}; }
        }
        const result = orchestrator.rlOptimizer.recordTelemetryEvent(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if ((reqPath === '/google-merchant-feed.xml' || reqPath === '/api/feeds/google-merchant.xml') && req.method === 'GET') {
    const feedFile = path.join(__dirname, 'google-merchant-feed.xml');
    if (fs.existsSync(feedFile)) {
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
      res.end(fs.readFileSync(feedFile, 'utf8'));
      return;
    }
  }

  """

# 1. Inject into server.js
with open('server.js', 'r', encoding='utf-8') as f:
    s = f.read()

target_server = "// Agent 2: Generative Vernacular Copywriter"
if '/api/rl/bandit-status' not in s:
    s = s.replace(target_server, server_code + target_server)
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(s)
    print("1. Added Agent 3 & 4 routes to server.js")
else:
    print("Agent 3 & 4 routes already in server.js")

# 2. Inject into api/index.js
api_code = """    // Agent 3 & Agent 4: Omni-Channel Dispatcher & Continuous RL Optimizer Loop
    if (reqPath === '/api/rl/bandit-status' && req.method === 'GET') {
      let orchestrator = null;
      try { orchestrator = require('./services/omniChannelOrchestratorService'); } catch(e) {}
      if (!orchestrator) { try { orchestrator = require('../services/omniChannelOrchestratorService'); } catch(e) {} }
      if (orchestrator) {
        return sendJson(200, orchestrator.rlOptimizer.getStatus());
      }
      return sendJson(500, { success: false, error: 'RL Optimizer service not loaded' });
    }

    if (reqPath === '/api/rl/optimize-step' && (req.method === 'POST' || req.method === 'GET')) {
      let orchestrator = null;
      try { orchestrator = require('./services/omniChannelOrchestratorService'); } catch(e) {}
      if (!orchestrator) { try { orchestrator = require('../services/omniChannelOrchestratorService'); } catch(e) {} }
      if (orchestrator) {
        return sendJson(200, { success: true, ...orchestrator.rlOptimizer.sampleArm() });
      }
      return sendJson(500, { success: false, error: 'RL Optimizer service not loaded' });
    }

    if (reqPath === '/api/rl/orchestrate-loop' && (req.method === 'POST' || req.method === 'GET')) {
      const body = req.method === 'POST' ? await getBody() : Object.fromEntries(queryParams.entries());
      let orchestrator = null;
      try { orchestrator = require('./services/omniChannelOrchestratorService'); } catch(e) {}
      if (!orchestrator) { try { orchestrator = require('../services/omniChannelOrchestratorService'); } catch(e) {} }
      if (orchestrator) {
        const result = await orchestrator.runAutonomousOrchestrationLoop(body);
        return sendJson(200, result);
      }
      return sendJson(500, { success: false, error: 'Orchestrator service not loaded' });
    }

    if (reqPath === '/api/dispatcher/dispatch' && req.method === 'POST') {
      const body = await getBody();
      let orchestrator = null;
      try { orchestrator = require('./services/omniChannelOrchestratorService'); } catch(e) {}
      if (!orchestrator) { try { orchestrator = require('../services/omniChannelOrchestratorService'); } catch(e) {} }
      if (orchestrator) {
        const [wa, merchant, mqtt] = await Promise.all([
          orchestrator.omniDispatcher.dispatchWhatsAppCloud(body),
          orchestrator.omniDispatcher.updateGoogleMerchantFeed(body),
          orchestrator.omniDispatcher.publishMqttCounterSignage(body)
        ]);
        return sendJson(200, { success: true, channels: { whatsapp: wa, google_merchant: merchant, mqtt_counter_signage: mqtt } });
      }
      return sendJson(500, { success: false, error: 'Dispatcher service not loaded' });
    }

    if (reqPath === '/api/telemetry/record' && req.method === 'POST') {
      const body = await getBody();
      let orchestrator = null;
      try { orchestrator = require('./services/omniChannelOrchestratorService'); } catch(e) {}
      if (!orchestrator) { try { orchestrator = require('../services/omniChannelOrchestratorService'); } catch(e) {} }
      if (orchestrator) {
        return sendJson(200, orchestrator.rlOptimizer.recordTelemetryEvent(body));
      }
      return sendJson(500, { success: false, error: 'Telemetry service not loaded' });
    }

    if ((reqPath === '/google-merchant-feed.xml' || reqPath === '/api/feeds/google-merchant.xml') && req.method === 'GET') {
      const feedCandidates = [
        path.join(__dirname, 'google-merchant-feed.xml'),
        path.join(__dirname, '..', 'google-merchant-feed.xml'),
        path.join(process.cwd(), 'google-merchant-feed.xml'),
        path.join(process.cwd(), 'public', 'google-merchant-feed.xml')
      ];
      const target = feedCandidates.find(p => fs.existsSync(p));
      if (target) {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.statusCode = 200;
        return res.end(fs.readFileSync(target, 'utf8'));
      }
    }

    """

with open('api/index.js', 'r', encoding='utf-8') as f:
    a = f.read()

target_api = "// Agent 2: Generative Vernacular Copywriter"
if '/api/rl/bandit-status' not in a:
    a = a.replace(target_api, api_code + target_api)
    with open('api/index.js', 'w', encoding='utf-8') as f:
        f.write(a)
    print("2. Added Agent 3 & 4 routes to api/index.js")
else:
    print("Agent 3 & 4 routes already in api/index.js")
