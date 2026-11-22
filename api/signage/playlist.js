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
    const state = digitalSignageService.getActiveState();
    res.status(200).json({
      success: true,
      playlist: state.playlist,
      count: state.playlist.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
