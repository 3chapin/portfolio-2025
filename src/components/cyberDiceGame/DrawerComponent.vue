<script setup lang="ts">
import EventHistory from '../icons/EventHistory.vue'
import SquaresIcon from '../icons/SquaresIcon.vue'
import UserMinus from '../icons/UserMinus.vue'
import type { drawerTypes } from '@/types/drawerTypes.ts'

const props = withDefaults(
	defineProps<{
		drawerOpen: boolean
		drawerType: drawerTypes
		historyVisible?: boolean
		height?: string
	}>(),
	{
		height: 'h-fit',
	},
)

const emit = defineEmits(['close', 'open-other'])

const handleClose = () => {
	emit('close')
}

const openOther = (type: drawerTypes) => {
	emit('open-other', type)
}
</script>

<template>
	<div
		id="overlay"
		v-if="props.drawerOpen"
		@click="handleClose"
		class="w-screen h-[72dvh] z-30 bottom-0 fixed"
	></div>

	<div
		id="drawer"
		:class="[
			`flex flex-col items-center p-6 fixed bottom-0 left-0 right-0 ${props.height}  h-fit max-h-[60dvh] pt-2 pb-6 gap-y-2 bg-gray-950 border-t-3 border-gray-500 rounded-4xl transform transition-all z-50  duration-300`,
			{
				'translate-y-0': props.drawerOpen,
				'translate-y-full': !props.drawerOpen,
			},
		]"
	>
		<div class="flex flex-row justify-between py-4 w-full max-w-85">
			<button
				name="close-drawer-button"
				@click="handleClose"
				@touchstart="() => {}"
				:class="props.drawerType === 'options' ? 'w-full' : ''"
				class="flex flex-row group items-center w-fit gap-x-2 max-h-12 justify-center text-gray-500 font-bold bg-gray-950 rounded p-3 text-xl self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				<span class="text-2xl">x</span>
				{{ props.drawerType === 'options' ? 'close' : '' }}
			</button>

			<button
				v-if="
					props.drawerType === 'eventHistory' || props.drawerType === 'players'
				"
				name="manual-roll-button"
				@click="openOther('manualRoll')"
				@touchstart="() => {}"
				class="flex flex-row group items-center w-fit gap-x-2 justify-center text-gray-500 font-bold bg-gray-950 rounded p-3 self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				<SquaresIcon class="stroke-gray-500 size-5 group-active:stroke-white" />
				enter roll
			</button>
			<button
				v-if="
					props.drawerType === 'eventHistory' ||
					props.drawerType === 'manualRoll'
				"
				name="players-button"
				@click="openOther('players')"
				@touchstart="() => {}"
				class="flex flex-row group items-center w-fit gap-x-2 justify-center text-gray-500 font-bold bg-gray-950 rounded p-3 self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white"
			>
				<UserMinus class="stroke-gray-500 size-5 group-active:stroke-white" />
				mark out
			</button>
			<button
				v-if="
					props.drawerType === 'players' || props.drawerType === 'manualRoll'
				"
				name="history-button"
				@click="openOther('eventHistory')"
				@touchstart="() => {}"
				:disabled="props.historyVisible === false"
				class="flex flex-row group items-center w-fit gap-x-2 justify-center text-gray-500 font-bold bg-gray-950 rounded p-3 self-center font-mono cursor-pointer hover:bg-gray-900 active:bg-gray-800 active:text-white disabled:cursor-default disabled:bg-gray-900 disabled:text-gray-700 disabled:border-none"
			>
				<EventHistory
					class="fill-gray-500 size-5 group-active:fill-white group-disabled:fill-gray-700"
				/>
				view past
			</button>
		</div>
		<slot></slot>
	</div>
</template>
