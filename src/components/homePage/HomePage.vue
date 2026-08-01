<script setup lang="ts">
import HeaderBar from '@/components/homePage/HeaderBar.vue'
import ProjectCard from '@/components/homePage/ProjectCard.vue'
</script>

<template>
	<HeaderBar />
	<main class="w-full h-fit px-8 pb-8 mt-60 flex justify-center">
		<div id="page-container" class="max-w-5xl w-full">
			<div class="flex flex-row flex-wrap gap-10 justify-center">
				<ProjectCard name="cyber dice" link="/cyber-dice" />
			</div>
		</div>
	</main>
</template>
