import '@/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setFavicon } from './utils/setFavicon'

async function clearLegacyPwaState() {
	if (!('serviceWorker' in navigator)) {
		return
	}

	const registrations = await navigator.serviceWorker.getRegistrations()
	await Promise.all(
		registrations.map((registration) => registration.unregister()),
	)

	if ('caches' in window) {
		const cacheKeys = await caches.keys()
		await Promise.all(cacheKeys.map((key) => caches.delete(key)))
	}
}

void clearLegacyPwaState()

router.afterEach((to) => {
	const favicon = to.meta.favicon as string | undefined
	setFavicon(favicon ?? '/assets/neon-favicon-32.png')

	document.title = (to.meta.title as string) ?? 'neon games'
})

const app = createApp(App)

app.use(router)

// Disable Vue DevTools
app.config.devtools = false

app.mount('#app')
