const { reconciliationService } = require('../../services/reconciliationService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const date = req.query?.date || '2026-04-01';
    const result = reconciliationService.matchUpi(date);
    res.status ? res.status(200).json({
      success: true,
      date: result.date,
      totalPosUpiBills: result.totalPosUpiBills,
      totalPosUpiAmount: result.totalPosUpiAmount,
      matchedCount: result.matchedCount,
      matchedAmount: result.matchedAmount,
      reconciliationRatePct: result.reconciliationRatePct,
      unreconciledPosBillsCount: result.unreconciledPosBillsCount,
      unreconciledBankCreditsCount: result.unreconciledBankCreditsCount,
      amountMismatchesCount: result.amountMismatchesCount,
      unreconciledPosBills: result.unreconciledPosBills,
      unreconciledBankCredits: result.unreconciledBankCredits,
      amountMismatches: result.amountMismatches
    }) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({
      success: true,
      date: result.date,
      totalPosUpiBills: result.totalPosUpiBills,
      totalPosUpiAmount: result.totalPosUpiAmount,
      matchedCount: result.matchedCount,
      matchedAmount: result.matchedAmount,
      reconciliationRatePct: result.reconciliationRatePct,
      unreconciledPosBillsCount: result.unreconciledPosBillsCount,
      unreconciledBankCreditsCount: result.unreconciledBankCreditsCount,
      amountMismatchesCount: result.amountMismatchesCount,
      unreconciledPosBills: result.unreconciledPosBills,
      unreconciledBankCredits: result.unreconciledBankCredits,
      amountMismatches: result.amountMismatches
    })));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
