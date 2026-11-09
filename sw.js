const CACHE = 'watphojae-v17';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/static/js/site-data.js',
    '/static/images/temple_logo.png',
    '/static/images/qr_donation.jpg',
    '/static/images/line_qr.jpg',
    '/manifest.json'
];
// ไฟล์ข้อมูล CMS — ไม่ cache เพื่อให้อัปเดตทันที
const DATA_URLS = [
    '/static/data/news.json',
    '/static/data/contact.json',
    '/static/data/events.json',
    '/static/data/gallery.json',
    '/static/data/abbots.json',
    '/static/data/officials.json',
    '/static/data/donation.json',
    '/static/data/site-settings.json'
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

    // Network only สำหรับ JSON data (ข่าว/ติดต่อ) — อัปเดตทันที
    if (DATA_URLS.some(u => url.pathname.includes(u))) {
        e.respondWith(fetch(e.request));
        return;
    }
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
