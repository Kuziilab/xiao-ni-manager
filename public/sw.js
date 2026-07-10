// Service Worker — 离线缓存
const CACHE_NAME = 'xiao-ni-manager-v1'

const STATIC_ASSETS = [
  '/xiao-ni-manager/',
  '/xiao-ni-manager/index.html',
  '/xiao-ni-manager/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => {
      self.skipWaiting()
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    }).then(() => {
      self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return

  // 对于 JS/CSS/HTML 使用 cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        // 缓存成功的响应
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
        }
        return response
      }).catch(() => {
        // 离线时返回缓存（如果已缓存）
        return cached || new Response('Offline', { status: 503 })
      })
    })
  )
})
