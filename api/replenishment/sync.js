const { syncHouseholdReplenishmentTracker } = require('../services/householdConsumptionService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const result = syncHouseholdReplenishmentTracker();
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error syncing household replenishment tracker:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
