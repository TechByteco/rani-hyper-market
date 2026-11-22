let procurement = null;
try {
  procurement = require('../../../services/procurementService').procurementService;
} catch (e) {
  try {
    procurement = require('../../services/procurementService').procurementService;
  } catch (e2) {
    console.warn('procurementService load notice:', e2.message);
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
    const url = new URL(req.url, 'http://localhost');
    const poNumber = req.query?.poNumber || url.searchParams.get('poNumber');
    if (!poNumber) throw new Error('Missing poNumber query parameter');
    if (!procurement) throw new Error('Procurement service unavailable');

    const html = procurement.renderPoHtml(poNumber);
    if (res.setHeader) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    res.status ? res.status(200).send(html) : (res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }), res.end(html));
  } catch (err) {
    res.status ? res.status(500).send(`<h3>Error generating PO View: ${err.message}</h3>`) : (res.writeHead(500, { 'Content-Type': 'text/plain' }), res.end(err.message));
  }
};
