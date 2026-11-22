const { googleMerchantSyncService } = require('../services/googleMerchantSyncService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const body = req.body || {};
    const result = googleMerchantSyncService.recordPriceOrStockChange(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('[GoogleMerchantDelta] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
