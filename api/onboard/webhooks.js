let saasService = null;
try {
  saasService = require('../../services/saasOnboardingService');
} catch (e) {
  try {
    saasService = require('../services/saasOnboardingService');
  } catch (e2) {
    try {
      saasService = require('./services/saasOnboardingService');
    } catch (e3) {
      console.warn('saasOnboardingService load notice:', e3.message);
    }
  }
}

function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data);
  }
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : (res.writeHead(200), res.end());
  }

  try {
    const data = saasService ? saasService.getWebhookSpecifications() : { success: false, error: 'SaaS service unavailable' };
    return sendJson(res, 200, data);
  } catch (err) {
    console.error('Error fetching webhook specifications:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
};
