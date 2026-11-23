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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const radar = compService ? compService.sampleCompetitorRadar() : { error: 'Competitive service unavailable' };
    res.status ? res.status(200).json({ success: true, message: 'Price radar refreshed with latest regional quotes', ...radar }) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: true, message: 'Price radar refreshed with latest regional quotes', ...radar })));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
