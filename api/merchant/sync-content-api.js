const { googleMerchantSyncService } = require('../services/googleMerchantSyncService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const result = await googleMerchantSyncService.syncPendingContentApiDeltas();
    res.status(200).json(result);
  } catch (error) {
    console.error('[GoogleContentApiSync] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
