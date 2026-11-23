let deliveryDispatch = null;
try {
  deliveryDispatch = require('../../services/deliveryDispatchService').deliveryDispatchService;
} catch (e) {
  try {
    deliveryDispatch = require('../../../services/deliveryDispatchService').deliveryDispatchService;
  } catch (e2) {
    console.warn('deliveryDispatchService load notice:', e2.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const orderId = req.query?.orderId || url.searchParams.get('orderId') || 'WA-9401';
    const html = deliveryDispatch ? deliveryDispatch.renderPackingSlipHtml(orderId) : '<h3>Dispatch service unavailable</h3>';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status ? res.status(200).send(html) : (res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }), res.end(html));
  } catch (err) {
    res.status ? res.status(500).send(err.message) : (res.writeHead(500, { 'Content-Type': 'text/plain' }), res.end(err.message));
  }
};
