let procurement = null;
try {
  procurement = require('../../services/procurementService').procurementService;
} catch (e) {
  try {
    procurement = require('../services/procurementService').procurementService;
  } catch (e2) {
    console.warn('procurementService load notice:', e2.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const code = req.query?.code || url.searchParams.get('code') || 'RICE-PONNI-25KG';
    if (!procurement) throw new Error('Procurement service unavailable');

    const eoqData = procurement.calculateEOQ(code);
    const result = {
      success: true,
      code,
      eoq: eoqData
    };
    res.status ? res.status(200).json(result) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(result)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
