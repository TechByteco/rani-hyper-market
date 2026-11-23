const { dispatchNotification, dispatchAllDueNotifications } = require('../services/householdConsumptionService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    if (body.allDue === true || body.allDue === 'true') {
      const result = dispatchAllDueNotifications();
      return res.status(200).json(result);
    }

    const { trackerId } = body;
    if (!trackerId) {
      return res.status(400).json({ success: false, error: 'trackerId is required' });
    }

    const result = dispatchNotification(trackerId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error dispatching replenishment notification:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
