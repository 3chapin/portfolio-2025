<script setup>
import NumberFlow from '@number-flow/vue';

defineProps({
    size: {
        type: String,
        default: 'text-base'
    },
    textMargin: {
        type: String,
        default: 'ml-1'
    },
    type: {
        type: String,
        default: 'font-mono'
    },
    color1: {
        type: String,
        default: 'text-cyan-300'
    },
    color2: {
        type: String,
        default: 'text-fuchsia-400'
    },
    value: {
        type: null,
        default: ''
    },
});
</script>

<template>
    <div class="grid text-center">
      <NumberFlow :class="`col-start-1 row-start-1 ${size} ${type} ${color1}`" :value />
      <NumberFlow :class="`col-start-1 row-start-1 ${textMargin} ${size} ${type} ${color2}`" :value/>
      <NumberFlow :class="`col-start-1 row-start-1 ${size} ${type} ${color1} blur-sm`" :value />
    </div>
</template>