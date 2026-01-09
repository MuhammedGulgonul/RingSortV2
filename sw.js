const CACHE_NAME = 'ring-sort-v1.1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './mobile.css',
    './game.js',
    './levels.js',
    './cloud-save.js',
    './three.min.js',
    './manifest.json',
    './icon_512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
