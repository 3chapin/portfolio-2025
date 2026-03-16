const CACHE_NAME = 'cyberdice-pwa-v1'
const urlsToCache = [
	'/',
	'/index.html',
	'/manifest.webmanifest',
	'/neon-icon-192.png',
	'/neon-icon-512.png',
	'/neon-splash-640x1136.png',
	'/neon-splash-750x1334.png',
	'/neon-splash-1125x2436.png',
	'/neon-splash-1242x2208.png',
	'/neon-splash-1242x2688.png',
	'/neon-splash-1536x2048.png',
	'/neon-splash-1668x2224.png',
	'/neon-splash-2048x2732.png',
	// Add more assets as needed
]

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache)
		}),
	)
})

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => caches.delete(name)),
			)
		}),
	)
})

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request)
		}),
	)
})
