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
  '/restaurant.html?id=1',    
  '/restaurant.html?id=2',    
  '/restaurant.html?id=3',    
  '/restaurant.html?id=4',    
  '/restaurant.html?id=5',    
  '/restaurant.html?id=6',    
  '/restaurant.html?id=7',    
  '/restaurant.html?id=8',    
  '/restaurant.html?id=9',    
  '/restaurant.html?id=10',    
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(restaurantCacheName).then(function (cache) {
    return cache.addAll(urlsToCache);
  }));
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
       // Cache hit - return response
       if (response) {
          return response;
       }
       else {
          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          let responseClone = event.request.clone();
          return fetch(responseClone).then(function (response) { 
             // Check if we received a valid response
             if(!response || response.status !== 200 || response.type !== 'basic') {
               return response;
             }
             // IMPORTANT: Clone the response. A response is a stream
             // and because we want the browser to consume the response
             // as well as the cache consuming the response, we need
             // to clone it so we have two streams.
             var responseToCache = response.clone();
             caches.open(restaurantCacheName).then(function (cache) {
                cache.put(event.request, responseToCache);
             });
             return response;
          });
       }       
    }));
});



