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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return typeof res.status === 'function' ? res.status(200).end() : (res.writeHead(200), res.end());
  }

  if (req.method === 'GET') {
    const prereqs = saasService ? saasService.getOnboardingPrerequisites() : { success: false, error: 'SaaS service unavailable' };
    return sendJson(res, 200, prereqs);
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (!body || typeof body === 'string') {
      try {
        body = JSON.parse(body || '{}');
      } catch (e) {
        body = {};
      }
    }

    try {
      const result = saasService ? saasService.provisionSaaSInstance(body) : { success: false, error: 'SaaS service unavailable' };
      return sendJson(res, result.success ? 201 : 400, result);
    } catch (err) {
      console.error('Error in SaaS instance provisioning:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  return sendJson(res, 405, { success: false, error: 'Method not allowed' });
};
