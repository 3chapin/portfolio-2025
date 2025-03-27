<script setup>
import Header from '@/components/Header.vue';
import ProjectCard from '@/components/ProjectCard.vue';
</script>

<template>
    <Header />
  <main class="w-full h-fit px-8 pb-8 mt-50 flex justify-center">
    <div id="page-container" class="max-w-5xl w-full">
      <div class="flex flex-row flex-wrap gap-10 justify-center">
        <ProjectCard name="Cyber Dice" link="/cyber-dice" />
        <ProjectCard name="Cyber Mail" link="/" />
      </div>
    </div>
  </main>
</template>