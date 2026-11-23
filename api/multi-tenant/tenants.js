const { getTenants } = require('../services/multiTenantService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { district } = req.query || {};
    const data = getTenants(district);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching regional tenants:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
