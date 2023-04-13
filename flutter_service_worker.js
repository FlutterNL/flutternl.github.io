'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "45d339e0213910a3cb4a1b61c6a141d3",
"index.html": "2f57e1990b8da181fc5979ef1698c77c",
"/": "2f57e1990b8da181fc5979ef1698c77c",
"main.dart.js": "4c7c2599f97b9fc0b75f0ff1ad962b9e",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "13397605912655bce2aae8d69e971505",
"icons/Icon-192.png": "c55fa5fd1c97098ed8d4281da47ca599",
"icons/Icon-512.png": "dcd70f7c03f7a86d1fc57f640b0c71b5",
"manifest.json": "336df6e999b33e23ef1d626e284cb1f4",
"assets/images/FlutterFestivalsLogo_color.png": "63769f6ab49d939fe0b2449119efc98d",
"assets/images/meetup_network_banner.png": "78013ff83a77bb11dbdcbbb57ecb26dd",
"assets/images/MapPin_1.png": "dbc2fb5aad9794955f6dfcfac69b499c",
"assets/images/Map.png": "501cb840e3334d60a7c14d22365108ad",
"assets/images/MapPin_2.png": "9d36c17b306cbc43728100b18ad0da89",
"assets/images/FlutterFestivalsLogo_white.png": "15eae84a0fd79de38f783ac0347b2f3c",
"assets/images/logos/wieken_holland.png": "d419d1ce9f130b172b27a954b7e64ec0",
"assets/images/logos/meetup.png": "e6e1bbffe5f680f247511e6013676fa3",
"assets/images/logos/holland.png": "309c8babea4bd580627ad7fb9e2e3ba0",
"assets/images/logos/wieken_netherlands.png": "5819308530d6566f875fa21e81ffe10e",
"assets/images/logos/wieken_twente.png": "d6f47cf5a82bc6119d8f322c980b4d8b",
"assets/images/logos/meetup_network.png": "a39f45290a605c5ed5ee83f67fac3d53",
"assets/images/logos/twente.png": "b196495196ea79fb73df48fe3b4800b3",
"assets/images/logos/netherlands.png": "1f0dce0e1370ec9334c5b97fc6ec33cf",
"assets/images/flutternl_background.png": "829650c439ea30b730d60b647e9b5f09",
"assets/images/Festival_SlideBG_01.png": "0612ccd1c04ba102fb6e759ea8c6fa3f",
"assets/images/Festival_SlideBG_02.png": "43446b6a9ab1501d2d39083a7764f0ad",
"assets/images/Festival_SlideBG_03.png": "f022dcc38bf880eb051eef63c288f7c8",
"assets/images/flutternl_festival_logo.png": "ce6d0fd3231dba703b7dc24ce8ec5745",
"assets/images/flutternl_foreground.png": "72d149056ebd3b78b8a50a6044e058f2",
"assets/images/Suitcase_0.png": "6d285c7177186853e4ccd231d563eda5",
"assets/AssetManifest.json": "8a2fc013bfa76bf4391963b8db0aa5aa",
"assets/NOTICES": "94bc0784916d7c4646e75466386673ad",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "aa1ec80f1b30a51d64c72f669c1326a7",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "5178af1d278432bec8fc830d50996d6f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b37ae0f14cbc958316fac4635383b6e8",
"assets/shaders/ink_sparkle.frag": "fd3b90d8111a195f097fbe99df31cb39",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
