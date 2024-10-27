const CACHE_NAME = "image-cache-v1";
const IMAGES_TO_CACHE = [
  "/images/item1.png",
  "/images/item2.png",
  "/images/item3.png",
  "/images/Tap/itemTapLevel1.png",
  "/images/Tap/itemTapLevel2.png",
  "/images/Tap/itemTapLevel3.png",
  "/images/Tap/itemTapLevel4.png",
  "/images/Tap/itemTapLevel5.png",
  "/images/Tap/itemTapLevel6.png",
  "/images/Tap/itemTapLevel7.png",
  "/images/Tap/itemTapLevel8.png",
  "/images/Tap/itemTapLevel9.png",
  "/images/Tap/itemTapHighLevel.png",
  "/images/coin.png",
  "/images/high-viltage.png",
  "/images/shp.png",
  "/images/bear.png",
  "/images/notcoin.png",
  "/images/trophy.png",
  "/images/loading.gif"
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
