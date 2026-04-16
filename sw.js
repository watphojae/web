const CACHE = 'watphojae-v2';
const ASSETS = [
    '/web/',
    '/web/index.html',
    '/web/style.css',
    '/web/script.js',
    '/web/static/js/site-data.js',
    '/web/static/images/temple_logo.png',
    '/web/static/images/qr_donation.jpg',
    '/web/static/images/line_qr.jpg',
    '/web/static/data/news.json',
    '/web/static/data/contact.json',
    '/web/manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    // ข้าม request ที่ไม่ใช่ GET หรือมาจาก extension
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (!url.protocol.startsWith('http')) return;

    // Network first สำหรับ HTML, Cache first สำหรับ assets
    if (e.request.headers.get('accept')?.includes('text/html')) {
        e.respondWith(
            fetch(e.request)
                .then(res => { caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; })
                .catch(() => caches.match(e.request))
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(cached => cached || fetch(e.request))
        );
    }
});
