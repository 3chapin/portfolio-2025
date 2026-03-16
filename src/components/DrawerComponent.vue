<script setup lang="ts">
import ArrowsLeftToRight from './icons/ArrowsLeftToRight.vue'
import CloseX from './icons/CloseX.vue'

const props = withDefaults(
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

const handleOther = () => {
	if (props.drawerType === 'manualRoll') {
		emit('openOther', 'players')
	} else {
		emit('openOther', 'manualRoll')
	}
}
</script>

<template>
	<div
		id="overlay"
		v-if="drawerOpen"
		@click="handleClose"
		class="w-screen h-[72dvh] z-30 bottom-0 fixed"
	></div>

	<div
		id="drawer"
		:class="[
			`flex flex-col items-center p-6 fixed bottom-0 left-0 right-0 ${height} h-fit max-h-[60dvh] pt-2 pb-6 gap-y-2 bg-gray-950 border-t-3 border-gray-500 rounded-4xl transform transition-transform z-50 transition-discrete duration-300`,
			{
				'translate-y-0': drawerOpen,
				'translate-y-full': !drawerOpen,
			},
		]"
	>
		<div class="flex flex-row justify-between py-4 w-full max-w-85">
			<button
				name="next-step"
				@click="handleClose"
				@touchstart="() => {}"
				:class="drawerType === 'options' ? 'w-full' : ''"
				class="flex flex-row group items-center w-fit gap-x-3 justify-center text-gray-500 font-semibold bg-gray-950 rounded p-3 text-sm self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				<CloseX class="stroke-gray-500 size-6 group-active:stroke-white" />
				close
			</button>
			<button
				v-if="props.drawerType !== 'options'"
				name="handle-other-button"
				@click="handleOther"
				@touchstart="() => {}"
				class="flex flex-row group items-center w-fit gap-x-4 justify-center text-gray-500 font-semibold bg-gray-950 rounded p-3 text-sm self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				switch
				<ArrowsLeftToRight
					class="stroke-gray-500 size-6 group-active:stroke-white"
				/>
			</button>
		</div>
		<slot></slot>
	</div>
</template>
