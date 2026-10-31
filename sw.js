const CACHE_NAME = 'multitoolpro';
const urlsToCache = [
    './', 
    './index.html', 
    './manifest.json',
    './tailwind.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// ১. ইনস্টল ইভেন্ট: ফাইলগুলো ক্যাশ করা হবে
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                urlsToCache.map(url => {
                    return cache.add(url).catch(() => {});
                })
            );
        })
    );
});

// ২. ফেচ ইভেন্ট: অফলাইন সাপোর্ট
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    if (navigator.onLine) {
        return; // অনলাইনে থাকলে সরাসরি ব্রাউজার নেটওয়ার্ক চলবে
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return new Response("You are offline.", { 
                status: 503, 
                statusText: "Offline" 
            });
        })
    );
});

// ৩. অ্যাক্টিভেট ইভেন্ট: পুরনো ক্যাশ মুছে ফেলা
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
        }).then(() => self.clients.claim())
    );
});
