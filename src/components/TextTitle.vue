<script setup>

defineProps({
    name: {
        type: String,
        default: '',
    },
    fontSize: {
        type: String,
        default: 'text-base',
    },
    height: {
        type: String,
        default: 'h-50',
    },
    smallWidth: {
        type: String,
        default: 'w-78',
    },
    bigWidth: {
        type: String,
        default: 'w-100',
    },
});
</script>

<template>
    <div :class="`rounded-br-none rounded-lg place-self-center bg-gray-950 ${smallWidth} ${height} sm:${bigWidth} border-3 border-cyan-300`">
        <div :class="`grid grid-rows-1 rounded backdrop-blur-md ${smallWidth} ${height} sm:${bigWidth} border-3 border-fuchsia-400 items-center justify-center`">
            <h2 :class="`col-start-1 row-start-1 w-fit ${fontSize} font-mono p-4 text-cyan-300`">{{ name }}</h2>
            <h2 :class="`col-start-1 row-start-1 w-fit ml-[1.5px] ${fontSize} font-mono p-4 text-fuchsia-400`">{{ name }}</h2>
            <h2 :class="`col-start-1 row-start-1 w-fit ${fontSize} font-mono p-4 text-cyan-300 blur-sm`">{{ name }}</h2>
        </div>
    </div>
</template>