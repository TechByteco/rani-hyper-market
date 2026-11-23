const fs = require('fs');
const path = require('path');

let rbacAuth = null;
try {
  rbacAuth = require('../services/rbacAuthService').rbacAuthService;
} catch (e) {
  try {
    rbacAuth = require('../../services/rbacAuthService').rbacAuthService;
  } catch (e2) {
    console.warn('rbacAuthService load notice:', e2.message);
  }
}

function readLocalJson(filename, defaultValue = null) {
  const possiblePaths = [
    path.join(process.cwd(), 'public', filename),
    path.join(process.cwd(), filename),
    path.join(__dirname, '..', 'public', filename),
    path.join(__dirname, '..', filename),
    path.join(__dirname, '..', '..', filename)
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {}
  }
  return defaultValue;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-rhm-role');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    let authRole = req.query?.role || url.searchParams.get('role') || req.headers?.['x-rhm-role'] || 'store_director';
    let authUser = null;

    const authHeader = req.headers?.['authorization'] || req.headers?.authorization;
    if (authHeader && rbacAuth) {
      const vRes = rbacAuth.verifyJwtToken(authHeader);
      if (vRes.valid) {
        authUser = vRes.payload;
        authRole = vRes.payload.role;
      }
    }

    if (authRole === 'cashier' || authRole === 'inventory_supervisor') {
      const errPayload = {
        success: false,
        error: `Forbidden: Role "${authRole}" is strictly prohibited from exporting customer contact details or phone records.`
      };
      res.status ? res.status(403).json(errPayload) : (res.writeHead(403, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(errPayload)));
      return;
    }

    let customers = readLocalJson('rani_customers.json', []);
    if (!Array.isArray(customers) && customers && Array.isArray(customers.value)) {
      customers = customers.value;
    }

    const payload = {
      success: true,
      exportAuthor: authUser ? authUser.name : 'Store Director',
      role: authRole,
      totalCustomers: customers.length,
      exportedAt: new Date().toISOString(),
      customers
    };

    res.status ? res.status(200).json(payload) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(payload)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
