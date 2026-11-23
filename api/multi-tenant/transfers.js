const { 
  getInventoryTransfers, 
  createInventoryTransfer, 
  receiveInventoryTransfer 
} = require('../services/multiTenantService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-tenant-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const tenantId = req.headers['x-tenant-id'] || (req.query && req.query.tenantId) || null;

    if (req.method === 'GET') {
      const { status } = req.query || {};
      const data = getInventoryTransfers(tenantId, status);
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const action = (req.query && req.query.action) || body.action || 'create';

      if (action === 'receive') {
        const { transferId, notes } = body;
        if (!transferId) {
          return res.status(400).json({ success: false, error: 'transferId is required to receive transfer' });
        }
        const result = receiveInventoryTransfer(transferId, notes);
        return res.status(result.success ? 200 : 400).json(result);
      }

      // Default: create transfer
      const result = createInventoryTransfer(body);
      return res.status(result.success ? 200 : 400).json(result);
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Error handling inventory transfers API:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
