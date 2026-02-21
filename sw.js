const STATIC_CACHE = "neon-bastion-static-v2026-02-21-3";
const RUNTIME_CACHE = "neon-bastion-runtime-v2026-02-21-3";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css?v=20260221a",
  "./game.js?v=20260221a",
  "./vendor/three.min.js",
  "./ambient_flute.mp3",
  "./boss_alien_talk.mp3",
  "./boss_wave20.mp3",
  "./enemy_shatter.mp3",
  "./manifest.webmanifest",
  "./icons/neon-bastion-icon-192.png",
  "./icons/neon-bastion-icon-512.png",
  "./icons/apple-touch-icon-180.png",
  "./icons/neon-bastion-icon.svg",
  "./icons/neon-bastion-icon-maskable.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAssetPath(pathname) {
  return /\.(?:css|js|mjs|json|webmanifest|png|jpg|jpeg|webp|svg|mp3|wav|ogg|woff2?)$/i.test(pathname);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
          return response;
        })
        .catch(async () => {
          const cachedPage =
            (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match("./index.html", { ignoreSearch: true })) ||
            (await caches.match("./", { ignoreSearch: true }));
          if (cachedPage) return cachedPage;
          throw new Error("Offline and no cached page available.");
        })
    );
    return;
  }

  if (isStaticAssetPath(url.pathname)) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
            return response;
          })
          .catch(() => caches.match(request, { ignoreSearch: true }));
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }))
  );
});
