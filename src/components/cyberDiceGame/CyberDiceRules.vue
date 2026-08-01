<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps<{
	showRules: boolean
	isMobileDevice: boolean | undefined
}>()

const emit = defineEmits(['close-rules'])

const scrollableContainer = ref<HTMLDivElement | null>(null)

const canScrollDown = ref<boolean>(false)
const canScrollUp = ref<boolean>(false)

const checkScrollPosition = () => {
	if (!scrollableContainer.value) return
	const { scrollTop, scrollHeight, clientHeight } = scrollableContainer.value
	canScrollDown.value = scrollTop + clientHeight < scrollHeight - 1
	canScrollUp.value = scrollTop > 1
}

// Check scroll position when modal opens
watch(
	() => props.showRules,
	async (isOpen) => {
		if (isOpen) {
			await nextTick()
			checkScrollPosition()
		}
	},
)

onMounted(() => {
	window.addEventListener('resize', checkScrollPosition)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', checkScrollPosition)
})
</script>

<template>
	<div
		id="game-rules"
		v-if="props.showRules === true"
		:class="props.isMobileDevice === false ? 'py-12' : ''"
		class="fixed inset-0 z-60 bg-gray-950/90 backdrop-blur-sm h-full overflow-hidden flex flex-col items-center pb-12 px-6"
	>
		<div
			id="rules"
			ref="scrollableContainer"
			@scroll="checkScrollPosition"
			:class="[
				canScrollDown
					? 'shadow-[inset_0px_-12px_16px_-16px] shadow-gray-400'
					: '',
				canScrollUp ? 'shadow-[inset_0px_12px_16px_-16px] shadow-gray-400' : '',
				canScrollDown && canScrollUp ? 'shadow-both' : '',
			]"
			class="mt-4 flex flex-col gap-y-4 overflow-y-scroll h-fit mb-15"
		>
			<ul
				class="text-gray-500 font-mono text-xl max-w-85 list-disc list-inside space-y-6 pb-6 hanging-indent"
			>
				<p class="mt-2 text-center text-white">how to play</p>
				<li>each player takes a turn rolling the dice</li>
				<li>The value of the roll is added to the group points</li>
				<p class="mt-2 text-center text-white">special rules</p>
				<p class="mt-2 text text-gray-300">
					for the first 3 rolls of each round
				</p>
				<li>a 7 is worth 70 points</li>
				<p class="mt-2 text text-gray-300">after the first 3 rolls</p>
				<li>rolling a 7 ends the round, and the group points reset to 0</li>
				<li>if doubles are rolled, the group points double</li>
				<p class="mt-2 text-center text-white">getting points</p>
				<li>at any time before the round ends, a player may “go out”</li>
				<li>
					when a player goes out, the current group points are added to their
					personal score
				</li>
				<li>
					once a player goes out, they don't roll again until the next round
				</li>
				<p class="mt-2 text-center text-white">winning the game</p>
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
				class="flex flex-row group items-center text-xl min-h-12 w-full gap-x-2 justify-center text-gray-500 font-bold rounded self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				<span class="text-2xl">x</span> close
			</button>
		</div>
	</div>
</template>

<style scoped>
.hanging-indent li {
	padding-left: 1.2em;
	text-indent: -1.2em;
}

.shadow-both {
	box-shadow:
		inset 0px 12px 12px -16px rgb(156 163 175),
		inset 0px -12px 12px -16px rgb(156 163 175);
}
</style>
