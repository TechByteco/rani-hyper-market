// Rani Hyper Market - Service Worker (PWA & Offline Resilience)
const CACHE_NAME = 'rani-market-v1.3';
const STATIC_ASSETS = [
  '/',
  '/store',
  '/store.html',
  '/admin',
  '/admin.html',
  '/product-images',
  '/product-images.html',
  '/marketing',
  '/marketing.html',
  '/orders',
  '/orders.html',
  '/index',
  '/index.html',
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
    url.pathname.endsWith('.jpeg') ||
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

  // Network-first with intelligent route fallback
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
          const path = url.pathname.toLowerCase();
          if (path.includes('admin') || path.includes('pos')) {
            return caches.match('/admin.html') || caches.match('/admin');
          }
          if (path.includes('photo') || path.includes('image') || path.includes('studio')) {
            return caches.match('/product-images.html') || caches.match('/product-images');
          }
          if (path.includes('market') || path.includes('sns') || path.includes('markbot')) {
            return caches.match('/marketing.html') || caches.match('/marketing');
          }
          if (path.includes('order')) {
            return caches.match('/orders.html') || caches.match('/orders');
          }
          return caches.match('/store.html') || caches.match('/store') || caches.match('/');
        }
      });
    })
  );
});
