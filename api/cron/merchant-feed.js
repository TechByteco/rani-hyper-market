const { googleMerchantSyncService } = require('../services/googleMerchantSyncService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const t0 = Date.now();
    const { meta } = googleMerchantSyncService.generateXmlFeed();
    const durationMs = Date.now() - t0;

    res.status(200).json({
      success: true,
      trigger: 'SCHEDULED_VERCEL_CRON_0200_AM_IST',
      executionTimeMs: durationMs,
      message: 'Google Merchant Center bilingual product feed successfully regenerated.',
      feed: meta
    });
  } catch (error) {
    console.error('[GoogleMerchantCron] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
