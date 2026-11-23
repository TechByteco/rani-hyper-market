let multiTenantService = null;
try {
  multiTenantService = require('../../services/multiTenantService');
} catch (e) {
  try {
    multiTenantService = require('../services/multiTenantService');
  } catch (e2) {
    try {
      multiTenantService = require('./services/multiTenantService');
    } catch (e3) {
      console.warn('multiTenantService load notice:', e3.message);
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : (res.writeHead(200), res.end());
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const search = (req.query && req.query.search) || url.searchParams.get('search') || null;
    const category = (req.query && req.query.category) || url.searchParams.get('category') || null;
    const brand = (req.query && req.query.brand) || url.searchParams.get('brand') || null;
    const barcode = (req.query && req.query.barcode) || url.searchParams.get('barcode') || null;

    const data = multiTenantService ? multiTenantService.getGlobalMasterCatalog({ search, category, brand, barcode }) : { success: false, error: 'Multi-tenant service unavailable' };
    return sendJson(res, 200, data);
  } catch (err) {
    console.error('Error fetching global FMCG catalog:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
};
