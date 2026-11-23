let driverService = null;
try {
  driverService = require('../../services/deliveryDriverService');
} catch (e) {
  try {
    driverService = require('../../../services/deliveryDriverService');
  } catch (e2) {
    console.warn('deliveryDriverService load notice:', e2.message);
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
    const url = new URL(req.url, 'http://localhost');
    const orderId = req.query?.orderId || url.searchParams.get('orderId') || 'WA-9401';
    const amount = req.query?.amount || url.searchParams.get('amount');

    const sampleOrder = {
      orderId,
      totalAmount: amount ? parseFloat(amount) : 1450.00
    };

    const upi = driverService ? driverService.generateUpiPaymentDetails(sampleOrder) : { error: 'Driver service unavailable' };
    res.status ? res.status(200).json({ success: true, orderId, ...upi }) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: true, orderId, ...upi })));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
