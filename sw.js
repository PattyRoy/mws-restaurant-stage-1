var restaurantCacheName = 'restaurant-cache';
var urlsToCache = [
  '/',
  'css/styles.css',
  '/data/restaurants.json',
  '/img/1_320.jpg',
  '/img/1.jpg',
  '/img/2_320.jpg',
  '/img/2.jpg',
  '/img/3_320.jpg',
  '/img/3.jpg',
  '/img/4_320.jpg',
  '/img/4.jpg',
  '/img/5_320.jpg',
  '/img/5.jpg',
  '/img/6_320.jpg',
  '/img/6.jpg',
  '/img/7_320.jpg',
  '/img/7.jpg',
  '/img/8_320.jpg',
  '/img/8.jpg',
  '/img/9_320.jpg',
  '/img/9.jpg',
  '/img/10_320.jpg',
  '/img/10.jpg',
  '/index.html',
  '/js/app.js',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/restaurant.html',
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(restaurantCacheName).then(function (cache) {
    return cache.addAll(urlsToCache);
  }));
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
       if (response) {
          return response;
       }
       else {
          return fetch(event.request).then(function (response) {
             let responseClone = response.clone();
        
             caches.open(restaurantCacheName).then(function (cache) {
                cache.put(event.request, responseClone);
             });
             return response;
          })
       }
});


