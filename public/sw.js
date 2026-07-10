// Service Worker — 离线缓存
const CACHE_NAME = 'xiao-ni-manager-v2'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map(key => caches.delete(key)))
    }).then(() => {
      self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  // 网络优先：先尝试网络，失败再用缓存
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.status === 200) {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone)
        })
      }
      return response
    }).catch(() => {
      return caches.match(event.request)
    })
  )
})
