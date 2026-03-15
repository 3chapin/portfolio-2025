<script setup lang="ts"></script>

<template>
	<header
		class="bg-gray-950 border-b-3 border-gray-900 z-10 fixed w-full h-fit top-0 flex justify-center p-8"
	>
		<div
			id="nav-container"
			class="bg-gray-950 w-full max-w-5xl text-center content-center flex flex-col gap-y-10"
		>
			<div id="nav-content" class="flex flex-row justify-center">
				<div
					class="cursor-default rounded-br-none rounded-lg bg-gray-950 w-30 h-12 border-3 border-cyan-300 animate-pulseHeader"
				>
					<div
						class="grid grid-rows-1 rounded backdrop-blur-md w-30 h-12 border-3 border-fuchsia-400 justify-center items-center animate-pulseHeader"
					>
						<p
							class="col-start-1 row-start-1 text-base font-mono p-2 text-cyan-300 animate-pulseHeader"
						>
							/.games
						</p>
						<p
							class="col-start-1 row-start-1 ml-0.75 text-base font-mono p-2 text-fuchsia-400 animate-pulseHeader"
						>
							/.games
						</p>
						<p
							class="col-start-1 row-start-1 text-base font-mono p-2 text-cyan-300 blur-sm"
						>
							/.games
						</p>
					</div>
				</div>
			</div>
			<p class="text-gray-600 text-sm sm:text-base font-mono italic">
				nearby, a neon sign hums weakly...
			</p>
		</div>
	</header>
</template>
