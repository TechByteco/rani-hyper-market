import re

print("=== ADDING /api/copywriter/generate TO server.js AND api/index.js ===")

# 1. Update server.js
with open('server.js', 'r', encoding='utf-8') as f:
    s = f.read()

target_server = "if ((reqPath === '/api/ai-marketing/generate' || reqPath === '/api/marketing/generate')"
server_route = """  // Agent 2: Generative Vernacular Copywriter (Bodinayakanur & Theni Consumers)
  if ((reqPath === '/api/copywriter/generate' || reqPath === '/api/ai/vernacular-copywriter') && (req.method === 'POST' || req.method === 'GET')) {
    const copywriterService = require('./services/vernacularCopywriterService');
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
        const result = await copywriterService.generateVernacularCampaign(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  """

if '/api/copywriter/generate' not in s:
    s = s.replace(target_server, server_route + target_server)
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(s)
    print("Added /api/copywriter/generate to server.js")
else:
    print("Already in server.js")

# 2. Update api/index.js
with open('api/index.js', 'r', encoding='utf-8') as f:
    a = f.read()

target_api = "if ((reqPath === '/api/ai-marketing/generate' || reqPath === '/api/marketing/generate')"
api_route = """    // Agent 2: Generative Vernacular Copywriter (Bodinayakanur & Theni Consumers)
    if ((reqPath === '/api/copywriter/generate' || reqPath === '/api/ai/vernacular-copywriter') && (req.method === 'POST' || req.method === 'GET')) {
      const body = req.method === 'POST' ? await getBody() : Object.fromEntries(queryParams.entries());
      try {
        let copywriterService = null;
        try { copywriterService = require('./services/vernacularCopywriterService'); } catch(e) {}
        if (!copywriterService) {
          try { copywriterService = require('../services/vernacularCopywriterService'); } catch(e) {}
        }
        if (copywriterService) {
          const result = await copywriterService.generateVernacularCampaign(body);
          return sendJson(200, result);
        }
        return sendJson(500, { success: false, error: 'Vernacular copywriter service not loaded' });
      } catch (err) {
        console.error('Error in vernacular copywriter endpoint:', err.message);
        return sendJson(500, { success: false, error: err.message });
      }
    }

    """

if '/api/copywriter/generate' not in a:
    a = a.replace(target_api, api_route + target_api)
    with open('api/index.js', 'w', encoding='utf-8') as f:
        f.write(a)
    print("Added /api/copywriter/generate to api/index.js")
else:
    print("Already in api/index.js")
