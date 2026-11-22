# Add /api/analytics/stock-velocity route to server.js and api/index.js

server_route = """
  if (reqPath === '/api/analytics/stock-velocity' && req.method === 'GET') {
    try {
      const p1 = path.join(__dirname, 'data', 'predicted_5yr_inventory_movement.json');
      const p2 = path.join(process.cwd(), 'data', 'predicted_5yr_inventory_movement.json');
      const target = fs.existsSync(p1) ? p1 : (fs.existsSync(p2) ? p2 : null);
      if (target) {
        const data = JSON.parse(fs.readFileSync(target, 'utf8') || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, ...data }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, meta: {}, products: {} }));
      }
    } catch(err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }
"""

with open('server.js', 'r', encoding='utf-8') as f:
    s_content = f.read()

if '/api/analytics/stock-velocity' not in s_content:
    target = "if (reqPath === '/api/analytics/customers' && req.method === 'GET') {"
    idx = s_content.find(target)
    if idx != -1:
        s_content = s_content[:idx] + server_route + "\n  " + s_content[idx:]
        with open('server.js', 'w', encoding='utf-8') as f:
            f.write(s_content)
        print("Added /api/analytics/stock-velocity to server.js")

api_route = """
    if (reqPath === '/api/analytics/stock-velocity' && req.method === 'GET') {
      try {
        const p1 = path.join(__dirname, '..', 'data', 'predicted_5yr_inventory_movement.json');
        const p2 = path.join(process.cwd(), 'data', 'predicted_5yr_inventory_movement.json');
        const p3 = path.join(__dirname, 'predicted_5yr_inventory_movement.json');
        const target = [p1, p2, p3].find(p => fs.existsSync(p));
        if (target) {
          const data = JSON.parse(fs.readFileSync(target, 'utf8') || '{}');
          return sendJson(200, { success: true, ...data });
        }
        return sendJson(200, { success: true, meta: {}, products: {} });
      } catch(err) {
        return sendJson(500, { success: false, error: err.message });
      }
    }
"""

with open('api/index.js', 'r', encoding='utf-8') as f:
    api_content = f.read()

if '/api/analytics/stock-velocity' not in api_content:
    target_api = "if (reqPath === '/api/inventory/fresh-markdowns' && req.method === 'GET') {"
    idx = api_content.find(target_api)
    if idx != -1:
        api_content = api_content[:idx] + api_route + "\n    " + api_content[idx:]
        with open('api/index.js', 'w', encoding='utf-8') as f:
            f.write(api_content)
        print("Added /api/analytics/stock-velocity to api/index.js")
