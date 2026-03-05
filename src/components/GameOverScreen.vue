<script setup lang="ts">
import CyberText from './CyberText.vue'
import { ref } from 'vue'

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
		<transition>
			<div
				v-if="step === 1"
				id="step-1-div"
				class="flex flex-col max-w-85 w-full h-full overflow-hidden items-center"
			>
				<CyberText
					size="text-3xl"
					text-margin="ml-[3px]"
					:value="'Game Over'"
				/>

				<p class="mt-5 font-mono text-white text-2xl">
					{{ playerRankings[0]?.name }} wins!
				</p>
				<p class="mt-5 font-mono text-white text-xl">
					{{ playerRankings[0]?.score.toLocaleString() }} points
				</p>
				<div
					ref="scoreboard-game-over"
					id="scoreboard-game-over"
					key="scoreboard-game-over"
					class="border-y-2 max-w-85 border-gray-900/60 self-center max-h-fit w-full overflow-y-scroll scroll-smooth py-4 mt-4 flex flex-col gap-y-4 flex-1"
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
					class="mt-15 flex flex-col bottom-8 fixed gap-y-7 max-w-85 w-full"
				>
					<button
						name="next-game-over"
						@click="() => (step = 2)"
						@touchstart="() => {}"
						class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						Next
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
					Back to Scoreboard
				</button>
				<button
					name="play-again"
					@click="() => emit('restartGame')"
					@touchstart="() => {}"
					class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
				>
					Play Again (Same Setup)
				</button>
				<button
					name="back-to-setup"
					@click="() => emit('goBackToSetup')"
					@touchstart="() => {}"
					class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
				>
					Change Setup
				</button>
				<button
					name="enter-roll"
					@click="() => emit('quitGame')"
					@touchstart="() => {}"
					class="font-semibold bg-gray-950 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-800 active:border-2border-red-400 text-red-400 active:border-red-400 active:ring-red-400 active:ring-2"
				>
					Quit
				</button>
			</div>
		</Transition>
	</div>
</template>
