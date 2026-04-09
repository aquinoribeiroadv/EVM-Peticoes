const CACHE = 'evm-peticoes-v4';
const ASSETS = [
  '/EVM-Peticoes/',
  '/EVM-Peticoes/index.html',
  '/EVM-Peticoes/manifest.json',
  '/EVM-Peticoes/icon-192.png',
  '/EVM-Peticoes/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Não cachear chamadas à API do Google
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('accounts.google.com') || url.hostname.includes('unpkg.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
