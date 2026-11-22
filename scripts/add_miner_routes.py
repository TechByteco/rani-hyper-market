print('=== ADDING MINER API ROUTES TO server.js & api/index.js ===')

# 1. Update server.js
with open('server.js', 'r', encoding='utf-8') as f:
    server_code = f.read()

target_marker_server = "if (reqPath === '/api/analytics/stock-velocity' && req.method === 'GET') {"
new_routes_server = """  // 7d. Agent 1: Basket & SKU Velocity Miner (High-Affinity Cross-Sells & DOI Alerts)
  if (reqPath === '/api/analytics/basket-affinity' && req.method === 'GET') {
    try {
      const candidates = [
        path.join(__dirname, 'data', 'high_affinity_cross_sells.json'),
        path.join(__dirname, 'public', 'high_affinity_cross_sells.json'),
        path.join(__dirname, 'high_affinity_cross_sells.json'),
        path.join(process.cwd(), 'data', 'high_affinity_cross_sells.json'),
        path.join(process.cwd(), 'high_affinity_cross_sells.json')
      ];
      const target = candidates.find(p => fs.existsSync(p));
      if (target) {
        const data = JSON.parse(fs.readFileSync(target, 'utf8') || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, ...data }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Basket affinity data not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (reqPath === '/api/analytics/doi-alerts' && req.method === 'GET') {
    try {
      const candidates = [
        path.join(__dirname, 'data', 'high_affinity_cross_sells.json'),
        path.join(__dirname, 'public', 'high_affinity_cross_sells.json'),
        path.join(__dirname, 'high_affinity_cross_sells.json'),
        path.join(process.cwd(), 'data', 'high_affinity_cross_sells.json')
      ];
      const target = candidates.find(p => fs.existsSync(p));
      if (target) {
        const data = JSON.parse(fs.readFileSync(target, 'utf8') || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          overstocked_alerts_doi_gt_60: data.overstocked_inventory_alerts || [],
          critical_stockout_alerts_doi_lt_15: data.critical_stockout_reorder_alerts || [],
          executive_kpis: data.executive_kpis || {}
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'DOI alerts not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (reqPath === '/api/analytics/stock-velocity' && req.method === 'GET') {"""

if '/api/analytics/basket-affinity' not in server_code and target_marker_server in server_code:
    server_code = server_code.replace(target_marker_server, new_routes_server)
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(server_code)
    print('-> Updated server.js with basket-affinity & doi-alerts routes.')
else:
    print('-> server.js already has routes or target not found.')

# 2. Update api/index.js
with open('api/index.js', 'r', encoding='utf-8') as f:
    api_code = f.read()

target_marker_api = "if (reqPath === '/api/analytics/stock-velocity' && req.method === 'GET') {"
new_routes_api = """    // Agent 1: Basket & SKU Velocity Miner (High-Affinity Cross-Sells & DOI Alerts)
    if (reqPath === '/api/analytics/basket-affinity' && req.method === 'GET') {
      try {
        const candidates = [
          path.join(__dirname, 'high_affinity_cross_sells.json'),
          path.join(__dirname, 'data', 'high_affinity_cross_sells.json'),
          path.join(__dirname, '..', 'data', 'high_affinity_cross_sells.json'),
          path.join(__dirname, '..', 'public', 'high_affinity_cross_sells.json'),
          path.join(process.cwd(), 'data', 'high_affinity_cross_sells.json'),
          path.join(process.cwd(), 'high_affinity_cross_sells.json')
        ];
        const target = candidates.find(p => fs.existsSync(p));
        if (target) {
          const data = JSON.parse(fs.readFileSync(target, 'utf8') || '{}');
          return sendJson(200, { success: true, ...data });
        }
        return sendJson(404, { success: false, error: 'Basket affinity data not found' });
      } catch (err) {
        return sendJson(500, { success: false, error: err.message });
      }
    }

    if (reqPath === '/api/analytics/doi-alerts' && req.method === 'GET') {
      try {
        const candidates = [
          path.join(__dirname, 'high_affinity_cross_sells.json'),
          path.join(__dirname, 'data', 'high_affinity_cross_sells.json'),
          path.join(__dirname, '..', 'data', 'high_affinity_cross_sells.json'),
          path.join(process.cwd(), 'data', 'high_affinity_cross_sells.json')
        ];
        const target = candidates.find(p => fs.existsSync(p));
        if (target) {
          const data = JSON.parse(fs.readFileSync(target, 'utf8') || '{}');
          return sendJson(200, {
            success: true,
            overstocked_alerts_doi_gt_60: data.overstocked_inventory_alerts || [],
            critical_stockout_alerts_doi_lt_15: data.critical_stockout_reorder_alerts || [],
            executive_kpis: data.executive_kpis || {}
          });
        }
        return sendJson(404, { success: false, error: 'DOI alerts not found' });
      } catch (err) {
        return sendJson(500, { success: false, error: err.message });
      }
    }

    if (reqPath === '/api/analytics/stock-velocity' && req.method === 'GET') {"""

if '/api/analytics/basket-affinity' not in api_code and target_marker_api in api_code:
    api_code = api_code.replace(target_marker_api, new_routes_api)
    with open('api/index.js', 'w', encoding='utf-8') as f:
        f.write(api_code)
    print('-> Updated api/index.js with basket-affinity & doi-alerts routes.')
else:
    print('-> api/index.js already has routes or target not found.')
