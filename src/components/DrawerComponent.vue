<script setup lang="ts">
import BackArrow from './icons/BackArrow.vue'

withDefaults(
	defineProps<{
		drawerOpen: boolean
		drawerType: string
		height?: string
	}>(),
	{
		height: 'h-fit',
	},
)

const emit = defineEmits(['close', 'openOther'])

const handleClose = () => {
	emit('close')
}
</script>

<template>
	<div
		id="overlay"
		v-if="drawerOpen"
		class="w-screen h-[90dvh] z-30 bottom-0 fixed"
	></div>

	<div
		id="drawer"
		:class="[
			`flex flex-col items-center p-6 fixed bottom-0 left-0 right-0 ${height} h-fit max-h-[65dvh] pt-2 pb-6 gap-y-2 bg-gray-950 border-t-3 border-gray-500 rounded-4xl transform transition-transform z-50 transition-discrete duration-300`,
			{
				'translate-y-0': drawerOpen,
				'translate-y-full': !drawerOpen,
			},
		]"
	>
		<div class="py-4 flex w-full max-w-85">
			<button
				name="next-step"
				@click="handleClose"
				@touchstart="() => {}"
				class="flex flex-row group items-center w-full gap-x-2 justify-center text-gray-500 font-semibold bg-gray-950 rounded p-3 pl-4 text-sm self-center font-mono cursor-pointer hover:bg-gray-800 active:bg-gray-900 active:text-white"
			>
				Hide
				<BackArrow
					class="rotate-270 stroke-gray-500 size-6 cursor-pointer group-active:stroke-white"
				/>
			</button>
		</div>
		<slot></slot>
	</div>
</template>
