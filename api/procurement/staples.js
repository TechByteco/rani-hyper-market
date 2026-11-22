let procurementModule = null;
try {
  procurementModule = require('../../services/procurementService');
} catch (e) {
  try {
    procurementModule = require('../services/procurementService');
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
    const service = procurementModule?.procurementService;
    const staples = procurementModule?.TOP_10_STAPLES || [];
    const enriched = staples.map(s => {
      const eoq = service ? service.calculateEOQ(s.code) : null;
      return {
        ...s,
        eoq
      };
    });

    const result = {
      success: true,
      totalCount: enriched.length,
      store: procurementModule?.STORE_PROFILE,
      staples: enriched
    };
    res.status ? res.status(200).json(result) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(result)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
