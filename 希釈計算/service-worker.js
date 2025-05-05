// サービスワーカーのキャッシュ名とバージョン
const CACHE_NAME = 'pesticide-dilution-calculator-v1';

// キャッシュするファイルのリスト
const CACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './icon.png',
  './icon.svg'
];

// サービスワーカーのインストール時の処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('キャッシュにファイルを追加中');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// サービスワーカーのアクティブ化時の処理
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 古いキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ネットワークリクエスト時の処理
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュ内に一致するものがあれば、それを返す
        if (response) {
          return response;
        }
        
        // キャッシュになければ、実際にリクエストを送信
        return fetch(event.request).then(
          response => {
            // 有効なレスポンスかチェック
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスを複製（ストリームは一度しか読めないため）
            const responseToCache = response.clone();
            
            // レスポンスをキャッシュに追加
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});