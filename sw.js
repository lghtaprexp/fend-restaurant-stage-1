const appName = 'restaurant-reviews'
const fixedCacheName = appName + '-v1.0';
const cacheImg = appName + '-img';

let toBeCache = [
	fixedCacheName,
	cacheImg
];

// Caching static content at when service worker is installed.
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(fixedCacheName).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        '/css/styles-large.css',
        '/css/styles-medium.css',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/map_api.js',
        'js/register_sw.js',
        '/js/restaurant_info.js',
        'data/restaurants.json'
      ]);
    })
  );
});

// Event handler to activate service worker and delete old cache.
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(function(cacheNames) {
  	  return Promise.all(
       	cacheNames.filter(function(cacheName) {
       	  return cacheName.startsWith(appName) &&
           	!toBeCache.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Event handler for fetch request.
self.addEventListener('fetch', function(evt) {
  	let requestURL = new URL(evt.request.url);

  // Get request made to page.
  if (requestURL.origin === location.origin) {
    if (requestURL.pathname.startsWith('/restaurant.html')) {
	  evt.respondWith(caches.match('/restaurant.html'));
        return;
	  }
    }

  // Cache images
  if (requestURL.pathname.startsWith('/img')) {
    evt.respondWith(loadImg(evt.request));
	  return;
  }

  // Respond with cache and fall back to network.
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
	  if (response) {
	    return response;
	  } else {
	    return fetch(evt.request);
	  }
    })
  );
});

function loadImg(request) {
  let storedImgUrl = request.url;

  storedImgUrl = storedImgUrl.replace(/-sm\.\w{3}|-md\.\w{3}|-lg\.\w{3}/i, '');

  return caches.open(cacheImg).then(function(cache) {
	return cache.match(storedImgUrl).then(function(response) {
      if (response) {
		return response;
   	  } else {
		return fetch(request).then(function(networkResponse) {
	      cache.put(storedImgUrl, networkResponse.clone());
		    return networkResponse;
			  });
			}
		});
	});
}