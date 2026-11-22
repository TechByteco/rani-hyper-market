const { digitalSignageService } = require('../services/digitalSignageService');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const displays = digitalSignageService.getConnectedDisplays();
    res.status(200).json({
      success: true,
      count: displays.length,
      displays
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
