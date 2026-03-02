<script setup lang="ts">
import { useOrdinal } from '@/composables/ordinal'

withDefaults(
	defineProps<{
		size?: string
		textMargin?: string
		type?: string
		color1?: string
		color2?: string
		value: string | number | null
		order?: number
	}>(),
	{
		size: 'text-base',
		textMargin: 'ml-1',
		type: 'font-mono',
		color1: 'text-cyan-300',
		color2: 'text-fuchsia-400',
		value: null,
	},
)
</script>

<template>
	<div class="grid text-center">
		<h2 :class="`col-start-1 row-start-1 ${size} ${type} ${color1}`">
			<span>{{ order }}</span
			><sup>{{ useOrdinal(order) }}</sup>
			{{ value }}
		</h2>
		<h2
			:class="`col-start-1 row-start-1 ${textMargin} ${size} ${type} ${color2}`"
		>
			<span>{{ order }}</span
			><sup>{{ useOrdinal(order) }}</sup>
			{{ value }}
		</h2>
		<h2 :class="`col-start-1 row-start-1 ${size} ${type} ${color1} blur-sm`">
			<span>{{ order }}</span
			><sup>{{ useOrdinal(order) }}</sup>
			{{ value }}
		</h2>
	</div>
</template>
