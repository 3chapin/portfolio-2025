<script setup lang="ts">
import CloseX from './icons/CloseX.vue'

const props = defineProps<{
	showRules: boolean
	isMobileDevice: boolean | undefined
}>()

const emit = defineEmits(['close-rules'])
</script>

<template>
	<div
		id="game-rules"
		v-if="props.showRules === true"
		:class="props.isMobileDevice === false ? 'py-12' : ''"
		class="fixed inset-0 z-60 bg-gray-950/90 backdrop-blur-sm h-full overflow-hidden flex flex-col items-center py-2 px-6"
	>
		<div
			id="rules"
			class="mt-4 flex flex-col gap-y-4 overflow-scroll h-fit mb-20"
		>
			<ul
				class="text-gray-500 font-mono text-sm max-w-80 list-disc list-inside space-y-4 pb-12 hanging-indent"
			>
				<p class="mt-2 text-lg text-center text-white">how to play</p>
				<li>each player takes a turn rolling the dice</li>
				<li>The value of the roll is added to the group points</li>
				<p class="mt-2 text-lg text-center text-white">special rules</p>
				<p class="mt-2 text text-gray-300">
					for the first 3 rolls of each round
				</p>
				<li>a 7 is worth 70 points</li>
				<p class="mt-2 text text-gray-300">after the first 3 rolls</p>
				<li>rolling a 7 ends the round, and the group points reset to 0</li>
				<li>if doubles are rolled, the group points double</li>
				<p class="mt-2 text-lg text-center text-white">getting points</p>
				<li>at any time before the round ends, a player may “go out”</li>
				<li>
					when a player goes out, the current group points are added to their
					personal score
				</li>
				<li>
					once a player goes out, they don't roll again until the next round
				</li>
				<p class="mt-2 text-lg text-center text-white">winning the game</p>
				<li>
					after the final round, the player with the most total points wins.
				</li>
			</ul>
		</div>
		<div
			id="close-rules-button"
			class="flex flex-col bottom-8 fixed gap-y-7 max-w-85 w-full"
		>
			<button
				name="close-rules-button"
				@click="emit('close-rules')"
				@touchstart="() => {}"
				class="flex flex-row group items-center w-full gap-x-3 justify-center text-gray-500 font-semibold rounded p-3 text-sm self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				<CloseX class="stroke-gray-500 size-6 group-active:stroke-white" />
				close
			</button>
		</div>
	</div>
</template>

<style scoped>
.hanging-indent li {
	padding-left: 1.2em;
	text-indent: -1.2em;
}
</style>
