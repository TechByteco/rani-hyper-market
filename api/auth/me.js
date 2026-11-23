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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-rhm-role');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    let token = req.headers?.['authorization'] || req.headers?.authorization;
    if (req.method === 'POST') {
      let body = req.body;
      if (!body || typeof body !== 'object') {
        let raw = '';
        await new Promise(r => {
          req.on('data', c => raw += c);
          req.on('end', r);
        });
        try { body = JSON.parse(raw || '{}'); } catch(e) { body = {}; }
      }
      if (body?.token) token = body.token;
    }

    const verifyRes = rbacAuth ? rbacAuth.verifyJwtToken(token) : { valid: false };
    if (verifyRes.valid) {
      res.status ? res.status(200).json({ success: true, valid: true, user: verifyRes.payload }) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: true, valid: true, user: verifyRes.payload })));
    } else {
      res.status ? res.status(401).json({ success: false, valid: false, error: verifyRes.error || 'Invalid or expired token' }) : (res.writeHead(401, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: false, valid: false, error: verifyRes.error || 'Invalid or expired token' })));
    }
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
