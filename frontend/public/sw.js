const CACHE = 'smart-msw-v1';

const PRECACHE = [
  '/',
  '/index.html',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Pass API requests through — no caching, fail gracefully when offline
  if (url.pathname.startsWith('/api')) return;

  // Stale-while-revalidate for everything else
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok && response.type !== 'opaque') {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      // Return cache immediately if available, update in background
      if (cached) {
        networkFetch; // fire-and-forget update
        return cached;
      }

      // Nothing in cache — wait for network
      const networkResponse = await networkFetch;
      if (networkResponse) return networkResponse;

      // Offline fallback for navigation
      if (request.mode === 'navigate') {
        return cache.match('/index.html');
      }
    })
  );
});
