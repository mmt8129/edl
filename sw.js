const CACHE_NAME = 'resimli-notlar-v1';
const urlsToCache = [
  'edl_4.html',
  'manifest.json',
  'icon.png'
];

// Service worker yüklendiğinde
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// İstekleri yakala
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'de varsa onu döndür
        if (response) {
          return response;
        }
        
        // Cache'de yoksa internetten al
        return fetch(event.request)
          .then(response => {
            // Geçerli cevap mı kontrol et
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cevabı cache'e ekle
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// Eski cache'leri temizle
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
