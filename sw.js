// 极简 Service Worker：不缓存任何内容，所有请求直连网络。
// 目的：让安卓 Chrome 能把站点「安装」成独立 App（点开不再跳浏览器），
// 同时保证你改完功能后刷新即可拿到最新版本，无需手动清缓存。
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) { e.respondWith(fetch(e.request)); });
