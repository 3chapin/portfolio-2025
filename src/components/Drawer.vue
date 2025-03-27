<script setup>
import CloseX from './icons/CloseX.vue';

defineProps({
  drawerOpen: Boolean,
  closeDrawer: Function,
});
</script>

<template>
  <div v-if="drawerOpen" @click="closeDrawer()" class="fixed inset-0 bg-gray-950 opacity-0 z-40"></div>


  <div id="drawer" :class="drawerOpen ? 'translate-y-0' : 'translate-y-full'" class="flex flex-col items-center fixed rounded-t-4xl bottom-0 left-0 right-0 h-fit max-h-full pt-2 pb-6 gap-y-2 bg-gray-950 border-t-2 border-gray-800 transform transition-transform z-50 transition-discrete duration-300">
        <div class="py-4 flex w-80">
          <CloseX @click="closeDrawer()" v-on:touchstart="" class="stroke-gray-500 size-7 cursor-pointer active:stroke-white" />
        </div>
        <slot></slot>
      </div>
</template>