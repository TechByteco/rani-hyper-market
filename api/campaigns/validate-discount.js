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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-rhm-role');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      let raw = '';
      await new Promise(r => {
        req.on('data', c => raw += c);
        req.on('end', r);
      });
      try { body = JSON.parse(raw || '{}'); } catch(e) { body = {}; }
    }

    const result = rbacAuth ? rbacAuth.validateMarginGuardrail(body) : { valid: false };
    const statusCode = result.valid ? 200 : 422;

    res.status ? res.status(statusCode).json({ success: result.valid, ...result }) : (res.writeHead(statusCode, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: result.valid, ...result })));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
