<script setup>
import { ref } from 'vue';

const input = ref(null);

const focusInput = () => {
  input.value?.focus();
};

defineExpose({ focusInput }); // Allows parent to call `reset()`

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
});

defineEmits(['update:modelValue']);
</script>

<template>
        <input
            ref="input"
            @input="$emit('update:modelValue', $event.target.value)" 
            :autofocus
            placeholder="Enter a name" 
            :name="name" 
            :value="modelValue"
            :class="`self-center rounded bg-gray-900 ${width} text-white font-mono tracking-wide px-3 h-12 focus:px-[10px] outline-0 focus:ring-2 focus:ring-cyan-300 focus:border-2 focus:border-fuchsia-400`"
            />
</template>