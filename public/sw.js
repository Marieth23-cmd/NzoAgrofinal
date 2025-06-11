importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { routing, strategies, expiration, cacheableResponse, rangeRequests } = workbox;

// Configuração básica
self.skipWaiting();
workbox.clientsClaim();

// Limpeza de caches antigos
workbox.cleanupOutdatedCaches();

// Rota para página offline
routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new strategies.NetworkOnly({
    plugins: [
      {
        handlerDidError: async () => {
          return caches.match('/page/offline.html');
        }
      }
    ]
  })
);

// Cache de recursos estáticos
routing.registerRoute(
  /\.(?:js|css|html)$/,
  new strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
);

// Cache de imagens
routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
  new strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
);

// Cache de fontes
routing.registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/,
  new strategies.CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
      })
    ]
  })
);

// Cache de APIs
routing.registerRoute(
  /^https:\/\/api\./,
  new strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutos
      }),
      new cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Evento de instalação
self.addEventListener('install', (event) => {
  const preCache = async () => {
    const cache = await caches.open('offline-cache');
    return cache.addAll([
      '/page/offline.html',
      '/images/logo.jpg',
      // Adicione outros recursos essenciais aqui
    ]);
  };
  event.waitUntil(preCache());
});