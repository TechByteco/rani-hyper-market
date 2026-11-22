const { googleMerchantSyncService } = require('../services/googleMerchantSyncService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    googleMerchantSyncService.streamMerchantFeed(req, res);
  } catch (error) {
    console.error('[GoogleMerchantStream] Error:', error);
    res.status(500).send(`Error streaming Google Merchant feed: ${error.message}`);
  }
};
