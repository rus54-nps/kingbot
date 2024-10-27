// service-worker.js

const CACHE_NAME = "image-cache-v1";
const IMAGES_TO_CACHE = [
  "/path/to/item1.png",
  "/path/to/item2.png",
  "/path/to/item3.png",
  "/path/to/itemTapLevel1.png",
  "/path/to/itemTapLevel2.png",
  "/path/to/itemTapLevel3.png",
  "/path/to/coin.png",   // добавляем также "coin" и другие иконки
  "/path/to/highVoltage.png",
  "/path/to/shp.png",
  "/path/to/bear.png",
  // Добавьте все пути к изображениям, которые нужно кэшировать
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(IMAGES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (IMAGES_TO_CACHE.some((url) => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
  }
});
