const { digitalSignageService } = require('../services/digitalSignageService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const aisle = req.query?.aisle || 'ALL';
    const state = digitalSignageService.getActiveState(aisle);
    res.status(200).json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
