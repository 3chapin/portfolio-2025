<script setup>

defineProps({
    name: {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
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

<template> <!-- I want to make the color of the card a little random based on the id of the object in it -->
<RouterLink v-on:touchstart="" id="card" :to='link'>
    <div :class="`rounded-br-none rounded-lg bg-gray-950 ${smallWidth} ${height} sm:${bigWidth} border-3 group hover:border-4 duration-200 cursor-pointer border-cyan-300`">
        <div :class="`grid grid-rows-1 rounded backdrop-blur-md ${smallWidth} ${height} sm:${bigWidth} border-3 border-fuchsia-400 items-center justify-center group-hover:hover:animate-pulseCard transition-all transition-discrete duration-200 group-active:bg-cyan-200/25`">
            <h2 class="col-start-1 row-start-1 w-fit text-lg font-mono p-4 text-cyan-300 transition-all transition-discrete duration-200 group-hover:animate-pulseCard">{{ name }}</h2>
            <h2 class="col-start-1 row-start-1 w-fit ml-[1.5px] text-lg font-mono p-4 text-fuchsia-400 transition-all transition-discrete duration-200 group-hover:animate-pulseCard">{{ name }}</h2>
            <h2 class="col-start-1 row-start-1 w-fit text-lg font-mono p-4 text-cyan-300 blur-sm">{{ name }}</h2>
        </div>
    </div>
</RouterLink>
</template>