// 這裡的版本號已經更新為 v3！
// 每次改完 index.html，只要把這個數字加 1 (例如下次變 v4)，客人的手機就會強制更新介面
const CACHE_NAME = 'ava-wealth-portal-v1.2'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './avawealth-192.png',  
  './avawealth-512.png',  
  './onetime-logo.png',   
  './wealthapp-logo.png'  
];

// 1. 安裝時將檔案加入快取
self.addEventListener('install', event => {
  // 強制立即接管控制權，加快更新速度
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 攔截網路請求，若無網路則提供快取檔案
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// 3. 更新時清除舊的快取，確保客人看到最新畫面
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 刪除 v2 等舊快取
          }
        })
      );
    })
  );
  // 啟動後立即控制所有打開的頁面
  return self.clients.claim();
});
