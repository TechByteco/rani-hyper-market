const { getTenantStoreInventory, FLAGSHIP_TENANT_ID } = require('../services/multiTenantService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-tenant-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const tenantId = req.headers['x-tenant-id'] || (req.query && req.query.tenantId) || FLAGSHIP_TENANT_ID;
    const { lowStockOnly, shelfLocation } = req.query || {};
    const data = getTenantStoreInventory(tenantId, { lowStockOnly, shelfLocation });
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching tenant store inventory:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
