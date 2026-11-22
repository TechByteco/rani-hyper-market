const { gstComplianceService } = require('../services/gstComplianceService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const title = req.query?.title || 'Item';
    const barcode = req.query?.barcode || '';
    const cls = gstComplianceService.classifyItem(title, barcode);
    res.status ? res.status(200).json({ success: true, title, barcode, classification: cls }) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: true, title, barcode, classification: cls })));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
