const CACHE_NAME = 'sveltekit-app-v1';
const ASSETS = [
  '/', // important if using adapter-static
  '/favicon-dark.png',
  '/favicon-light.png',
  '/manifest.json',
  // You can add pre-rendered routes or static assets here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip POST requests or others
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cached => {
      return (
        cached ||
        fetch(request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        }).catch(() => {
          // optionally return fallback content
        })
      );
    })
  );
});
