/**
 * securityAndCatalogHelper.js
 * Shared CORS, Timing-Safe Admin Auth, and Cached Paginated Catalog Search
 * Used by both local server.js and Vercel serverless api/index.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/rani-hyper-market(-[a-z0-9-]+)?\.vercel\.app$/i,
  /^https:\/\/rani-hyper-market-[a-z0-9]+-saali\.vercel\.app$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
  /^http:\/\/(192\.168|10\.)\d+\.\d+(:\d+)?$/i
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin.trim()));
}

function applySecurityAndCorsHeaders(req, res) {
  const origin = req.headers && req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), payment=(self "https://pay.google.com")');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isAuthorizedAdmin(req, bodyKey = '') {
  const expectedKey = process.env.ADMIN_API_KEY || process.env.RANI_ADMIN_KEY || 'admin123';
  const headerKey = (req.headers && req.headers['x-admin-key']) || '';
  const authHeader = (req.headers && req.headers['authorization']) || '';
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';

  return safeEqual(String(headerKey), expectedKey) ||
         safeEqual(String(bearerToken), expectedKey) ||
         safeEqual(String(bodyKey || ''), expectedKey);
}

let cachedCatalog = null;
let cachedCatalogMtime = 0;

function loadCatalogOnce() {
  const candidates = [
    path.join(process.cwd(), 'products_catalog.json'),
    path.join(__dirname, 'products_catalog.json'),
    path.join(process.cwd(), 'public', 'products_catalog.json'),
    path.join(process.cwd(), 'rani_products.json'),
    path.join(__dirname, 'rani_products.json')
  ];

  for (const fp of candidates) {
    try {
      if (fs.existsSync(fp)) {
        const stat = fs.statSync(fp);
        if (cachedCatalog && cachedCatalogMtime === stat.mtimeMs) {
          return cachedCatalog;
        }
        const parsed = JSON.parse(fs.readFileSync(fp, 'utf8'));
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedCatalog = parsed;
          cachedCatalogMtime = stat.mtimeMs;
          return cachedCatalog;
        }
      }
    } catch (e) {}
  }
  return cachedCatalog || [];
}

function getPaginatedCatalog(queryParams) {
  const catalog = loadCatalogOnce();
  const q = (queryParams.get('q') || '').trim().toLowerCase();
  const category = (queryParams.get('category') || '').trim().toLowerCase();
  const inStock = queryParams.get('inStock') === 'true';
  const sort = (queryParams.get('sort') || 'default').trim().toLowerCase();
  const page = Math.max(1, parseInt(queryParams.get('page') || '1', 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(queryParams.get('limit') || '40', 10) || 40));

  let filtered = catalog;

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => String(p.category || '').toLowerCase().includes(category));
  }

  if (inStock) {
    filtered = filtered.filter((p) => Number(p.stock || 0) > 0);
  }

  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((p) => {
      const hay = `${p.title || p.name || ''} ${p.category || ''} ${p.barcode || ''} ${p.sku || ''} ${p.brand || ''}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }

  if (sort === 'price_asc') {
    filtered = [...filtered].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (sort === 'price_desc') {
    filtered = [...filtered].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  } else if (sort === 'discount') {
    filtered = [...filtered].sort((a, b) => {
      const da = Number(a.mrp || 0) > Number(a.price || 0) ? (Number(a.mrp) - Number(a.price)) / Number(a.mrp) : 0;
      const db = Number(b.mrp || 0) > Number(b.price || 0) ? (Number(b.mrp) - Number(b.price)) / Number(b.mrp) : 0;
      return db - da;
    });
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    success: true,
    total,
    page: safePage,
    limit,
    totalPages,
    items
  };
}

module.exports = {
  isAllowedOrigin,
  applySecurityAndCorsHeaders,
  isAuthorizedAdmin,
  getPaginatedCatalog
};
