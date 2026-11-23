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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status ? res.status(204).end() : (res.writeHead(204), res.end());
    return;
  }

  try {
    let input = null;
    if (req.method === 'POST') {
      let body = req.body;
      if (!body || typeof body !== 'object') {
        let raw = '';
        await new Promise(r => {
          req.on('data', c => raw += c);
          req.on('end', r);
        });
        try { body = JSON.parse(raw || '{}'); } catch(e) { body = {}; }
      }
      input = body.address || body.coordinates || body.location || body;
    } else {
      const url = new URL(req.url, 'http://localhost');
      const address = req.query?.address || url.searchParams.get('address') || url.searchParams.get('q');
      const lat = req.query?.lat || url.searchParams.get('lat');
      const lng = req.query?.lng || url.searchParams.get('lng') || url.searchParams.get('lon');
      input = (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : (address || 'Bodinayakanur');
    }

    const result = deliveryDispatch ? deliveryDispatch.validateDeliveryGeofence(input) : { error: 'Dispatch service unavailable' };
    res.status ? res.status(200).json(result) : (res.writeHead(200, { 'Content-Type': 'application/json' }), res.end(JSON.stringify(result)));
  } catch (err) {
    res.status ? res.status(500).json({ error: err.message }) : (res.writeHead(500, { 'Content-Type': 'application/json' }), res.end(JSON.stringify({ error: err.message })));
  }
};
