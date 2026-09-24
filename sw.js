const CACHE_NAME = 'totoquest-v15';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './assets/loading-bg.jpg', './assets/girl-front.png', './assets/girl-back.png',
  './assets/boy-front.png', './assets/boy-back.png',
  './assets/girl-front-sm.png', './assets/girl-back-sm.png',
  './assets/boy-front-sm.png', './assets/boy-back-sm.png',
  './assets/totos/pumpkin_pup.png', './assets/totos/sm/pumpkin_pup.png',
  './assets/totos/cobweb_crab.png', './assets/totos/sm/cobweb_crab.png',
  './assets/totos/boo_berry.png', './assets/totos/sm/boo_berry.png',
  './assets/totos/candle_imp.png', './assets/totos/sm/candle_imp.png',
  './assets/totos/candy_bat.png', './assets/totos/sm/candy_bat.png',
  './assets/totos/grave_pebble.png', './assets/totos/sm/grave_pebble.png',
  './assets/totos/potion_slime.png', './assets/totos/sm/potion_slime.png',
  './assets/totos/moon_moth.png', './assets/totos/sm/moon_moth.png',
  './assets/totos/bone_bean.png', './assets/totos/sm/bone_bean.png',
  './assets/totos/witchcap_sprout.png', './assets/totos/sm/witchcap_sprout.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  // Intentionally no self.skipWaiting() here — the new version waits until the
  // player taps the in-app "Update available" banner before taking over.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Network-first for the app shell so a new deploy is detected promptly;
  // falls back to the cached copy when offline.
  event.respondWith(
    fetch(event.request).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match(event.request))
  );
});
