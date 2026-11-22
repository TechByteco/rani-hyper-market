let procurement = null;
try {
  procurement = require('../../../services/procurementService').procurementService;
} catch (e) {
  try {
    procurement = require('../../services/procurementService').procurementService;
  } catch (e2) {
    console.warn('procurementService load notice:', e2.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    let body = {};
    if (req.body && typeof req.body === 'object') {
      body = req.body;
    } else if (req.body && typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } catch (_) {}
    } else {
      let raw = '';
      req.on && req.on('data', chunk => raw += chunk);
      await new Promise(resolve => req.on ? req.on('end', resolve) : resolve());
      if (raw) {
        try { body = JSON.parse(raw); } catch (_) {}
      }
    }

    if (!procurement) throw new Error('Procurement service unavailable');
    const result = procurement.createPurchaseOrder(body);

    res.status ? res.status(200).json(result) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(result)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
