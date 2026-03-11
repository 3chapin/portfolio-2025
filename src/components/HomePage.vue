<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
import ProjectCard from '@/components/ProjectCard.vue'
</script>

<template>
	<HeaderBar />
	<main class="w-full h-fit px-8 pb-8 mt-50 flex justify-center">
		<div id="page-container" class="max-w-5xl w-full">
			<div class="flex flex-row flex-wrap gap-10 justify-center">
				<ProjectCard name="Cyber Dice" link="/cyber-dice" />
			</div>
		</div>
	</main>
</template>
