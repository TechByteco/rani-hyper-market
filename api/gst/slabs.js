const { GST_CONFIG, HSN_MASTER } = require('../services/gstComplianceService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const data = {
      success: true,
      store: GST_CONFIG.tradeName,
      gstin: GST_CONFIG.gstin,
      state: `${GST_CONFIG.stateCode}-${GST_CONFIG.stateName}`,
      historicalSlabShares: GST_CONFIG.historicalSlabShares,
      hsnMasterCount: Object.keys(HSN_MASTER).length,
      hsnMaster: HSN_MASTER
    };
    res.status ? res.status(200).json(data) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(data)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
