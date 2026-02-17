const CACHE_NAME="fpas-v2";

const urlsToCache=[
  "./",
  "./index.html",
  "./dashboard.html",
  "./style.css",
  "./app.js",
  "./dashboard.js"
];

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(response=>{
      return response||fetch(e.request);
    })
  );
});
