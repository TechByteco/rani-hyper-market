let deliveryDispatch = null;
try {
  deliveryDispatch = require('../services/deliveryDispatchService').deliveryDispatchService;
} catch (e) {
  try {
    deliveryDispatch = require('../../services/deliveryDispatchService').deliveryDispatchService;
  } catch (e2) {
    console.warn('deliveryDispatchService load notice:', e2.message);
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
    const manifests = deliveryDispatch ? deliveryDispatch.getManifests() : [];
    res.status ? res.status(200).json({ success: true, count: manifests.length, manifests }) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ success: true, count: manifests.length, manifests })));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
