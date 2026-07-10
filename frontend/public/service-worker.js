const CACHE_NAME    = 'sucihome-v1'
const OFFLINE_URL   = '/offline.html'

const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/logo-192.png',
  '/logo-512.png',
  '/logo.png',
  '/favicon.ico',
]

// Install — cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — network first, cache fallback
self.addEventListener('fetch', event => {
  // Skip non-GET and API calls
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/')
  ) return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(() => {
        // Return cached version or offline page
        return caches.match(event.request)
          || caches.match(OFFLINE_URL)
      })
  )
})

// Push notifications (for booking updates)
self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  self.registration.showNotification(
    data.title || 'SuciHome',
    {
      body : data.body  || 'Your booking update',
      icon : '/logo-192.png',
      badge: '/logo-192.png',
      data : { url: data.url || '/' },
    }
  )
})

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(
      event.notification.data?.url || '/'
    )
  )
})
