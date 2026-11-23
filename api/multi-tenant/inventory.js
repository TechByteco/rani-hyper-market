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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-tenant-id');

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : (res.writeHead(200), res.end());
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const tenantId = req.headers['x-tenant-id'] || (req.query && req.query.tenantId) || url.searchParams.get('tenantId') || null;
    const category = (req.query && req.query.category) || url.searchParams.get('category') || null;
    const lowStockOnly = ((req.query && req.query.lowStockOnly) || url.searchParams.get('lowStockOnly')) === 'true';

    const data = multiTenantService ? multiTenantService.getTenantStoreInventory(tenantId, { category, lowStockOnly }) : { success: false, error: 'Multi-tenant service unavailable' };
    return sendJson(res, 200, data);
  } catch (err) {
    console.error('Error fetching tenant store inventory:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
};
