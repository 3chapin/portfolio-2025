import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Cyber Dice',
				short_name: 'CyberDice',
				start_url: '.',
				display: 'standalone',
				background_color: '#18181b',
				theme_color: '#18181b',
				description: 'A cyber-themed dice game.',
				icons: [
					{
						src: '/assets/mjlowell-icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/assets/mjlowell-icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
		}),
	],

	base: '/',
	optimizeDeps: {
		include: ['number-flow'],
	},
	ssr: {
		noExternal: ['number-flow'],
	},
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
