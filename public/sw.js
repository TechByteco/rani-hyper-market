// Rani Hyper Market - Service Worker (PWA & Offline Resilience)
const CACHE_NAME = 'rani-market-v1.1';
const STATIC_ASSETS = [
  '/',
  '/store',
  '/index',
  '/manifest.json',
  '/favicon.ico',
  '/images/rani_logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET or cross-origin analytics/mutation APIs
  if (req.method !== 'GET') return;
  if (url.pathname.startsWith('/api/pos/sell') || url.pathname.startsWith('/api/pos/order')) return;

  // Cache-first for images and fonts
  if (
    req.destination === 'image' ||
    req.destination === 'font' ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Network-first with fallback to cache for HTML / dynamic pages
  event.respondWith(
    fetch(req).then((res) => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
      }
      return res;
    }).catch(() => {
      return caches.match(req).then((cached) => {
        if (cached) return cached;
        if (req.mode === 'navigate') {
          return caches.match('/store') || caches.match('/');
        }
      });
    })
  );
});
