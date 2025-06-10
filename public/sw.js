// Service Worker PWA completo e otimizado
const CACHE_NAME = "meu-pwa-cache-v2";
const STATIC_CACHE = "static-cache-v2";
const DYNAMIC_CACHE = "dynamic-cache-v2";

// URLs para cache imediato (arquivos estáticos críticos)
const STATIC_URLS = [
  "/",
  "/favicon.ico",
  "/manifest.json",
  "/offline.html", // página offline personalizada
];

// Padrões de URLs para cache dinâmico
const CACHE_PATTERNS = {
  static: [
    /\/_next\/static\//,
    /\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$/,
  ],
  pages: [
    /^\/(?!api\/)/,
  ]
};

// Evento de instalação: cache arquivos críticos
self.addEventListener("install", event => {
  console.log("[SW] Instalando Service Worker...");
  
  event.waitUntil(
    Promise.all([
      // Cache arquivos estáticos críticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log("[SW] Cacheando arquivos estáticos");
        return cache.addAll(STATIC_URLS);
      }),
      // Pre-cache alguns recursos do Next.js se disponíveis
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log("[SW] Cache dinâmico inicializado");
        return Promise.resolve();
      })
    ]).then(() => {
      console.log("[SW] Instalação concluída");
      // Força ativação imediata
      return self.skipWaiting();
    })
  );
});

// Evento de ativação: limpeza de caches antigos
self.addEventListener("activate", event => {
  console.log("[SW] Ativando Service Worker...");
  
  event.waitUntil(
    Promise.all([
      // Remove caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== CACHE_NAME
            )
            .map(cacheName => {
              console.log("[SW] Removendo cache antigo:", cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Assume controle de todas as páginas
      self.clients.claim()
    ]).then(() => {
      console.log("[SW] Ativação concluída - SW está no controle");
    })
  );
});

// Intercepta todas as requisições
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignora requisições para outras origens e APIs
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Função principal para lidar com requisições
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Estratégia 1: Cache First para recursos estáticos
    if (isStaticResource(url)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }
    
    // Estratégia 2: Network First para páginas e conteúdo dinâmico
    if (isPageRequest(request)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }
    
    // Estratégia 3: Stale While Revalidate para outros recursos
    return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.log("[SW] Erro ao processar requisição:", error);
    return await handleOffline(request);
  }
}

// Cache First: ideal para recursos estáticos que não mudam
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log("[SW] Cache hit:", request.url);
    return cachedResponse;
  }
  
  console.log("[SW] Cache miss, buscando da rede:", request.url);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First: ideal para conteúdo que muda frequentemente
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log("[SW] Network first para:", request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log("[SW] Rede falhou, tentando cache:", request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate: serve do cache e atualiza em background
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Busca da rede em background (não bloqueia)
  const networkPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(error => {
    console.log("[SW] Erro na atualização em background:", error);
  });
  
  // Retorna cache imediatamente se disponível, senão espera a rede
  return cachedResponse || networkPromise;
}

// Tratamento para quando tudo falha (offline)
async function handleOffline(request) {
  // Para navegação, retorna página offline
  if (request.destination === 'document') {
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Para imagens, retorna placeholder se disponível
  if (request.destination === 'image') {
    const placeholderImage = await caches.match('/placeholder.png');
    if (placeholderImage) {
      return placeholderImage;
    }
  }
  
  // Resposta padrão offline
  return new Response(
    JSON.stringify({ 
      error: 'Offline', 
      message: 'Conteúdo não disponível offline' 
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Funções auxiliares para classificar requisições
function isStaticResource(url) {
  return CACHE_PATTERNS.static.some(pattern => pattern.test(url.pathname));
}

function isPageRequest(request) {
  return request.destination === 'document' ||
         (request.method === 'GET' && 
          request.headers.get('accept')?.includes('text/html'));
}

// Escuta mensagens do cliente (para controle manual)
self.addEventListener("message", event => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0]?.postMessage({ version: CACHE_NAME });
        break;
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0]?.postMessage({ success: true });
        });
        break;
    }
  }
});

// Função para limpar todos os caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log("[SW] Todos os caches foram limpos");
}

// Evento para sincronização em background (se suportado)
self.addEventListener("sync", event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      console.log("[SW] Executando sincronização em background")
    );
  }
});

// Log de inicialização
console.log(`[SW] Service Worker ${CACHE_NAME} carregado e pronto!`);