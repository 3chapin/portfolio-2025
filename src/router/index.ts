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
				title: 'mjlowell',
				favicon: '/default.png',
			},
		},
		{
			path: '/cyber-dice',
			name: 'cyber-dice',
			component: CyberDiceView,
			meta: {
				title: 'Cyber Dice',
				favicon: '/cyber-dice-logo.png',
			},
		},
	],
})

export default router
