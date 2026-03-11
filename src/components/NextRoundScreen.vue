<script setup lang="ts">
import CyberText from './CyberText.vue'

// Props for gameData and isMobileDevice
defineProps<{
	currentRound: number
	isMobileDevice: boolean | undefined
}>()
</script>

<template>
	<div
		id="next-round-overlay"
		:class="isMobileDevice === false ? 'py-12' : ''"
		class="fixed inset-0 z-60 bg-gray-950/90 backdrop-blur-sm flex flex-col items-center justify-center py-2 px-6"
	>
		<CyberText
			size="text-2xl"
			text-margin="ml-[4px]"
			:value="`Round ${currentRound}`"
			class="animate-pulseHeader"
		/>
	</div>
</template>
