<script setup lang="ts">
import CyberText from './CyberText.vue'
import { ref, onMounted, onUnmounted } from 'vue'

// Props for gameData, playerRankings, isMobileDevice
defineProps<{
	playerRankings: Array<{
		id: number
		name: string
		score: number
		rank: number
	}>
	isMobileDevice: boolean | undefined
}>()

const emit = defineEmits(['restartGame', 'goBackToSetup', 'quitGame'])

const step = ref<1 | 2>(1)

// --- Firework Animation ---

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null

// Pixel firework particle
interface Particle {
	x: number
	y: number
	vx: number
	vy: number
	color: string
	life: number
	maxLife: number
	size: number
}

const colors = [
	'#e879f9', // fuchsia-400
	// '#34d399', // green-400
	'#67e8f9', // cyan-300
	// '#60a5fa', // blue-400
	// '#818cf8', // indigo-400
	// '#a78bfa', // purple-400
	// '#f87171', // red-400
	// '#facc15', // yellow-400
	'#f3f4f6', // gray-100
]

function randomInt(a: number, b: number) {
	return Math.floor(Math.random() * (b - a + 1)) + a
}

let particles: Particle[] = []
let lastFirework = 0

function launchFirework(width: number, height: number) {
	const x = randomInt(Math.floor(width * 0.2), Math.floor(width * 0.8))
	const y = randomInt(Math.floor(height * 0.2), Math.floor(height * 0.5))
	const color = colors[randomInt(0, colors.length - 1)] ?? '#fff'
	const count = randomInt(18, 28)
	for (let i = 0; i < count; i++) {
		const angle = (Math.PI * 2 * i) / count + Math.random() * 0.1
		const speed = Math.random() * 2 + 1.5
		particles.push({
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			color: color,
			life: 0,
			maxLife: randomInt(70, 90), // Increased for slower fade
			size: randomInt(3, 6),
		})
	}
}

function animateFireworks() {
	const canvas = canvasRef.value
	if (!canvas) return
	const ctx = canvas.getContext('2d')
	if (!ctx) return
	const dpr = window.devicePixelRatio || 1
	const width = window.innerWidth
	const height = Math.round(window.innerHeight * 0.3) // Only top 30% of viewport
	canvas.width = width * dpr
	canvas.height = height * dpr
	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	ctx.clearRect(0, 0, width, height)

	// Launch new firework every 1000-2000ms
	const now = Date.now()
	if (now - lastFirework > randomInt(1000, 2000)) {
		launchFirework(width, height)
		lastFirework = now
	}

	// Update and draw particles
	for (let i = particles.length - 1; i >= 0; i--) {
		const p = particles[i]
		if (!p) continue
		p.x += p.vx
		p.y += p.vy
		p.vy += 0.04 // gravity
		p.life++
		// Fade out
		const alpha = Math.max(0, 1 - p.life / p.maxLife)
		ctx.globalAlpha = alpha
		ctx.fillStyle = p.color
		ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
		ctx.globalAlpha = 1
		if (p.life > p.maxLife) {
			particles.splice(i, 1)
		}
	}

	animationFrameId = requestAnimationFrame(animateFireworks)
}

function handleResize() {
	// Redraw on resize
	animateFireworks()
}

onMounted(() => {
	if (canvasRef.value) {
		animateFireworks()
		window.addEventListener('resize', handleResize)
	}
})

onUnmounted(() => {
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId)
	}
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<div
		id="game-over-overlay"
		:class="[
			isMobileDevice === false ? 'py-12' : '',
			step === 1 ? '' : 'justify-center',
		]"
		class="fixed inset-0 z-60 pb-26 bg-gray-950/90 backdrop-blur-sm overflow-hidden flex flex-col items-center py-2 px-6"
	>
		<!-- Firework Canvas Background -->
		<canvas
			v-show="step === 1"
			ref="canvasRef"
			class="firework-canvas"
			aria-hidden="true"
		></canvas>

		<transition>
			<div
				v-if="step === 1"
				id="step-1-div"
				class="flex flex-col max-w-85 w-full h-full overflow-hidden items-center"
			>
				<CyberText
					id="game-over-text"
					size="text-2xl"
					text-margin="ml-[4px]"
					:value="'game-over'"
					class="mt-10 animate-pulseHeader"
				/>

				<p class="mt-5 font-mono font-semibold text-white text-lg">
					{{ playerRankings[0]?.name }}-wins!
				</p>
				<p class="mt-2 font-mono font-medium text-white text">
					{{ playerRankings[0]?.score.toLocaleString() }}-points
				</p>
				<div
					ref="scoreboard-game-over"
					id="scoreboard-game-over"
					key="scoreboard-game-over"
					class="border-y-2 max-w-85 border-gray-900/60 self-center max-h-fit w-full overflow-y-scroll scroll-smooth py-4 mt-20 flex flex-col gap-y-4 flex-1"
				>
					<transition-group>
						<div
							id="player-row"
							v-for="(player, index) in playerRankings.filter(
								(p) => p.id !== playerRankings[0]?.id,
							)"
							:key="player.id"
							:class="index % 2 === 1 ? 'bg-gray-900/70' : ''"
							class="flex flex-row rounded items-center min-h-14 max-h-14 mx-0.5 justify-between text-center px-3 transition-all duration-400"
						>
							<CyberText
								text-margin="ml-[3px]"
								:value="player.rank + ' ' + player.name"
							/>
							<div
								id="player-score-info"
								class="flex flex-col h-full gap-y-1.5 justify-center items-end self-stretch"
							>
								<p class="text-white font-mono text-base">
									{{ player.score.toLocaleString() }}
								</p>
								<p class="text-gray-600 font-mono text-sm">
									{{
										(player.score - playerRankings[0]!.score).toLocaleString()
									}}
								</p>
							</div>
						</div>
					</transition-group>
				</div>
				<div
					id="step-1-button"
					:class="isMobileDevice ? 'bottom-12' : ''"
					class="mt-15 flex flex-col bottom-8 fixed gap-y-7 max-w-85 w-full"
				>
					<button
						name="next-game-over"
						@click="() => (step = 2)"
						@touchstart="() => {}"
						class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						next
					</button>
				</div>
			</div>
		</transition>
		<Transition>
			<div
				v-if="step === 2"
				id="game-over-buttons"
				:class="isMobileDevice === false ? 'bottom-12' : ''"
				class="mt-15 flex flex-col gap-y-7 max-w-85 w-full"
			>
				<button
					name="back-game-over"
					@click="() => (step = 1)"
					@touchstart="() => {}"
					class="text-gray-500 font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-gray-500 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
				>
					back-to-scoreboard
				</button>
				<button
					name="play-again-button"
					@click="() => emit('restartGame')"
					@touchstart="() => {}"
					class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
				>
					play-again
				</button>
				<button
					name="back-to-setup-button"
					@click="() => emit('goBackToSetup')"
					@touchstart="() => {}"
					class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
				>
					change-setup
				</button>
				<button
					name="quit-game-button"
					@click="() => emit('quitGame')"
					@touchstart="() => {}"
					class="font-semibold bg-gray-950 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-800 active:border-2border-red-400 text-red-400 active:border-red-400 active:ring-red-400 active:ring-2"
				>
					quit-game
				</button>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.firework-canvas {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 30vh;
	z-index: 61; /* Above overlay (z-60), below content */
	pointer-events: none;
	background: transparent;
}
</style>
