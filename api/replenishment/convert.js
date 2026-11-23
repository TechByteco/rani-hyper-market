const { recordReorderConversion } = require('../services/householdConsumptionService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { trackerId, voucherNo } = req.body || {};
    if (!trackerId) {
      return res.status(400).json({ success: false, error: 'trackerId is required' });
    }

    const result = recordReorderConversion(trackerId, { voucherNo });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error recording reorder conversion:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
