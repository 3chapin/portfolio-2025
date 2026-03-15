import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import CyberDiceView from '@/views/CyberDiceView.vue'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: {
				title: 'neon games',
				favicon: '/assets/neon-favicon-32.png',
			},
		},
		{
			path: '/cyber-dice',
			name: 'cyber-dice',
			component: CyberDiceView,
			meta: {
				title: 'cyber-dice',
				favicon: '/assets/cyber-dice-favicon-32.png',
			},
		},
	],
})

export default router
