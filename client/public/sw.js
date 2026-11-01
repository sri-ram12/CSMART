// Chandhana Shoe Mart - Service Worker v3 (Network-First & Auto-Clearing)
const CACHE_NAME = 'csm-cache-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Wipe out all old stale caches so browsers don't hold outdated HTML/JS bundles
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Don't intercept API calls or non-GET requests
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  // HTML Navigation Requests -> ALWAYS Network-First
  // Prevents white screen caused by cached HTML pointing to outdated hashed JS bundles
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/index.html') || caches.match('/'))
    );
    return;
  }

  // Static Assets -> Network First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
