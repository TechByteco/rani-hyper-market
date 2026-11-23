let compService = null;
try {
  compService = require('../../services/competitiveIntelligenceService');
} catch (e) {
  try {
    compService = require('../../../services/competitiveIntelligenceService');
  } catch (e2) {
    console.warn('competitiveIntelligenceService load notice:', e2.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const sku = req.query?.sku || url.searchParams.get('sku') || 'OIL-GOLD-1L';

    const svg = compService ? compService.renderComparativeBannerSvg(sku) : '<svg><text>Service Unavailable</text></svg>';
    
    if (res.setHeader) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    res.status ? res.status(200).send(svg) : (res.writeHead(200, { 'Content-Type': 'image/svg+xml' }), res.end(svg));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
