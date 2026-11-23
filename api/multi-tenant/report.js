const { getMultiTenantSummaryReport } = require('../services/multiTenantService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const report = getMultiTenantSummaryReport();
    return res.status(200).json(report);
  } catch (err) {
    console.error('Error generating multi-tenant network report:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
