// KrishiConnect — PWA Service Worker (v1.1.0)
const CACHE_NAME = 'krishiconnect-shell-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install: Pre-cache core shell safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {
              // Ignore failure for optional assets during initial install
            })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate: Purge stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Strategy with strict privacy & security constraints
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Security constraint: NEVER cache API routes, auth calls, callback handlers, or external calls
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.includes('/auth/callback') ||
    url.hostname.includes('supabase.co') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Navigation requests: Network-First; fallback to /offline on network failure
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Do not cache redirects or server error responses
          if (response.ok && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline') || caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets (CSS, JS, Fonts, Images): Cache-First with Stale-While-Revalidate
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
