const { getReplenishmentTracker } = require('../services/householdConsumptionService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { category, status, dueOnly } = req.query || {};
    const data = getReplenishmentTracker({ category, status, dueOnly });
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching replenishment tracker:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
