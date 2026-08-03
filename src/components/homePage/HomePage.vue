<script setup lang="ts">
import HeaderBar from '@/components/homePage/HeaderBar.vue'
import ProjectCard from '@/components/homePage/ProjectCard.vue'
</script>

<template>
	<HeaderBar />
	<main class="w-full min-h-full px-8 mt-60 flex justify-center">
		<div id="page-container" class="mt-10 max-w-5xl w-full min-h-full">
			<div
				class="flex flex-row flex-wrap gap-10 py-1 min-h-full justify-center"
			>
				<ProjectCard name="cyber dice" link="/cyber-dice" />
			</div>
		</div>
	</main>
</template>
