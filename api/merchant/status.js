const { googleMerchantSyncService, STORE_CONFIG } = require('../services/googleMerchantSyncService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const meta = googleMerchantSyncService.getFeedMetadata();
    const journal = googleMerchantSyncService.getDeltaJournal(10);
    const pendingDeltas = journal.filter(j => j.contentApi && j.contentApi.status === 'QUEUED_FOR_PUSH').length;

    res.status(200).json({
      success: true,
      store: STORE_CONFIG.storeName,
      location: STORE_CONFIG.address,
      merchantId: STORE_CONFIG.merchantId,
      feed: meta,
      deltaSync: {
        pendingCount: pendingDeltas,
        recentDeltas: journal.slice(0, 5)
      },
      contentApi: {
        version: 'v2.1',
        mode: 'Real-time Webhook + Batch CustomBatch',
        endpoint: `https://shoppingcontent.googleapis.com/content/v2.1/${STORE_CONFIG.merchantId}/products/custombatch`
      },
      bilingualSchema: {
        languages: ['English', 'Tamil (தமிழ்)'],
        regionalTargeting: 'Bodinayakanur & Theni District (625513)',
        voiceSearchIntegration: 'Active'
      }
    });
  } catch (error) {
    console.error('[GoogleMerchantStatus] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
