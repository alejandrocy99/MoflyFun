const CACHE_NAME = 'gym-app-v1'; // Cambia 'v1' a 'v2' cada vez que hagas un cambio grande
const ASSETS = [
  'index.html',
  'manifest.json',
  // Añade aquí otros archivos locales si los tienes
];

// Instalación: Guarda los archivos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Fuerza a que el nuevo SW se active de inmediato
});

// Activación: Borra cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Toma el control de la página inmediatamente
});

// Estrategia: Network First (Intenta red, si falla usa caché)
// Esto asegura que si hay internet, descargue la versión de GitHub
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});