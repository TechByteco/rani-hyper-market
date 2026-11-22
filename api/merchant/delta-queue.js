const { googleMerchantSyncService } = require('../services/googleMerchantSyncService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const limit = parseInt(req.query?.limit || '50', 10);
    const queue = googleMerchantSyncService.getDeltaJournal(limit);
    res.status(200).json({
      success: true,
      count: queue.length,
      queue
    });
  } catch (error) {
    console.error('[GoogleMerchantDeltaQueue] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
