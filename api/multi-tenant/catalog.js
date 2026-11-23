const { getGlobalMasterCatalog } = require('../services/multiTenantService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { query, category } = req.query || {};
    const data = getGlobalMasterCatalog({ query, category });
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error querying global master catalog:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
