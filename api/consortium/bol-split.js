let consortiumService = null;
try {
  consortiumService = require('../../services/consortiumProcurementService');
} catch (e) {
  try {
    consortiumService = require('../services/consortiumProcurementService');
  } catch (e2) {
    try {
      consortiumService = require('./services/consortiumProcurementService');
    } catch (e3) {
      console.warn('consortiumProcurementService load notice:', e3.message);
    }
  }
}

function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data);
  }
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : (res.writeHead(200), res.end());
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const commodityId = (req.query && req.query.commodityId) || url.searchParams.get('commodityId') || 'COMM-TOOR-DAL-A';
    const data = consortiumService ? consortiumService.generateSplitBillsOfLading(commodityId) : { success: false, error: 'Consortium service unavailable' };
    return sendJson(res, 200, data);
  } catch (err) {
    console.error('Error generating split bills of lading:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
};
