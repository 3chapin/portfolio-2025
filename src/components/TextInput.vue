<script setup lang="ts">
import { ref } from 'vue'

const input = ref<HTMLInputElement | null>(null)

const focusInput = () => {
	input.value?.focus()
}

defineExpose({ focusInput }) // Allows parent to call `reset()`

defineProps({
	width: {
		type: String,
		default: 'w-80',
	},
	name: {
		type: String,
		default: '',
	},
	autofocus: {
		type: Boolean,
		default: false,
	},
	modelValue: {
		type: String,
		default: '',
	},
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	emit('update:modelValue', target.value)
}
</script>

<template>
	<input
		ref="input"
		@input="handleInput"
		:autofocus
		placeholder="Enter a name"
		:name="name"
		:value="modelValue"
		:class="`self-center rounded bg-gray-900 ${width} text-white font-mono tracking-wide px-3 h-12 focus:px-2.5 outline-0 focus:ring-2 focus:ring-cyan-300 focus:border-2 focus:border-fuchsia-400`"
	/>
</template>
