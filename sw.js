// Service Worker：network-first + 预缓存
// 联网时优先取最新页面（改功能后刷新即生效）；
// 断网/弱网时用上次缓存打开，保证小米等浏览器「离线查看」也能正常启动。
const CACHE = 'wb-v1';
const PRECACHE = ['./', './index.html', './sw.js'];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  // 只处理同域的 GET 请求
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }
  e.respondWith(
    fetch(req)
      .then(res => {
        // 成功则缓存副本，下次离线可用
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
  );
});
