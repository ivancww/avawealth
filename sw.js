const CACHE_NAME = 'ava-wealth-portal-v2'; // 更新版本號以確保更新
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './avawealth-192.png',  // 快取新的主 Logo
  './avawealth-512.png',  // 快取新的主 Logo
  './onetime-logo.png',   // 快取原來 OneTime 的 Logo
  './wealthapp-logo.png'  // 快取原來 WealthAPP 的 Logo
];

// 安裝時將檔案加入快取
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求，若無網路則提供快取檔案
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有，就回傳快取；否則透過網路抓取
        return response || fetch(event.request);
      })
  );
});

// 更新時清除舊的快取
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
