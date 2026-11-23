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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-tenant-id');

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : (res.writeHead(200), res.end());
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const tenantId = req.headers['x-tenant-id'] || (req.query && req.query.tenantId) || url.searchParams.get('tenantId') || null;

    if (req.method === 'GET') {
      const status = (req.query && req.query.status) || url.searchParams.get('status') || null;
      const data = multiTenantService ? multiTenantService.getInventoryTransfers(tenantId, status) : { success: false, error: 'Multi-tenant service unavailable' };
      return sendJson(res, 200, data);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (!body || typeof body === 'string') {
        try {
          body = JSON.parse(body || '{}');
        } catch (e) {
          body = {};
        }
      }
      const action = (req.query && req.query.action) || url.searchParams.get('action') || body.action || 'create';

      if (action === 'receive') {
        const { transferId, notes } = body;
        if (!transferId) {
          return sendJson(res, 400, { success: false, error: 'transferId is required to receive transfer' });
        }
        const result = multiTenantService ? multiTenantService.receiveInventoryTransfer(transferId, notes) : { success: false, error: 'Multi-tenant service unavailable' };
        return sendJson(res, result.success ? 200 : 400, result);
      }

      // Default: create transfer
      const result = multiTenantService ? multiTenantService.createInventoryTransfer(body) : { success: false, error: 'Multi-tenant service unavailable' };
      return sendJson(res, result.success ? 200 : 400, result);
    }

    return sendJson(res, 405, { success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Error handling inventory transfers API:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
};
