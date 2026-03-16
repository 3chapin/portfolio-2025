<script setup lang="ts">
import CyberText from './CyberText.vue'
const props = defineProps({
	show: { type: Boolean, required: true },
	type: { type: String, default: '' },
	message: { type: String, default: '' },
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
	<div
		v-if="props.show"
		class="fixed inset-0 z-70 bg-gray-950/90 backdrop-blur-sm flex flex-col items-center justify-center py-2 px-6"
	>
		<div class="flex flex-col items-center w-full max-w-85 p-0">
			<CyberText
				value="are-you-sure?"
				size="text-2xl"
				text-margin="ml-[4px]"
				class="animate-pulseHeader mb-4 mt-2"
			/>
			<p v-if="props.message" class="text-gray-400 font-mono mb-6 text-center">
				{{ props.message }}
			</p>
			<div
				id="modal-buttons"
				class="flex flex-col items-center gap-y-7 w-full justify-center mt-10"
			>
				<button
					class="px-4 py-2 w-full rounded font-mono font-semibold bg-gray-950 text-white border-2 cursor-pointer border-white hover:bg-gray-900 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					@click="$emit('confirm', props.type)"
					@touchstart="() => {}"
				>
					{{
						props.type === 'restart'
							? 'restart-game'
							: props.type === 'setup'
								? 'back-to-setup'
								: props.type === 'quit'
									? 'quit-game'
									: ''
					}}
				</button>
				<button
					class="px-4 py-2 w-full max-w-85 rounded font-mono font-semibold bg-gray-950 text-gray-400 border-2 cursor-pointer border-gray-600 hover:bg-gray-900 active:text-white active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					@click="$emit('cancel')"
					@touchstart="() => {}"
				>
					cancel
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.z-70 {
	z-index: 70;
}
</style>
