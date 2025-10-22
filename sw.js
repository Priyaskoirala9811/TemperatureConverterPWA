const CACHE_NAME = 'temperature-converter-v1';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      './',
      './index.html',
      './converter.js',
      './converter.css',
      './manifest.json',
      './icon512.png'
    ]);
    console.log('Service worker: files cached');
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Try cache first
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Otherwise, try the network and cache new files
    try {
      const fetchResponse = await fetch(event.request);
      cache.put(event.request, fetchResponse.clone());
      return fetchResponse;
    } catch (e) {
      console.log('Fetch failed; returning offline page if available.');
    }
  })());
});
