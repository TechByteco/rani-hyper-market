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
    let body = req.body;
    if (!body || typeof body !== 'object') {
      let raw = '';
      await new Promise(r => {
        req.on('data', c => raw += c);
        req.on('end', r);
      });
      try { body = JSON.parse(raw || '{}'); } catch(e) { body = {}; }
    }

    const { event, orderId, riderId } = body;
    if (!event || !orderId) {
      const errRes = { success: false, error: 'Missing required event (PACKED, OUT_FOR_DELIVERY, DELIVERED) or orderId' };
      res.status ? res.status(400).json(errRes) : (res.writeHead(400, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(errRes)));
      return;
    }

    const updateRes = driverService ? driverService.updateOrderStatus(orderId, event, riderId) : { error: 'Driver service unavailable' };
    res.status ? res.status(200).json(updateRes) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(updateRes)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
