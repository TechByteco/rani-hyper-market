const { gstComplianceService } = require('../../services/gstComplianceService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const month = req.query?.month || '2026-04';
    const result = gstComplianceService.getSummary(month);
    const data = {
      success: true,
      period: result.metadata?.period,
      periodLabel: result.metadata?.periodLabel,
      gstin: result.metadata?.gstin,
      table: 'Table 7: B2C (Small) Invoices',
      count: result.b2cs?.length || 0,
      b2cs: result.b2cs || []
    };
    res.status ? res.status(200).json(data) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(data)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
