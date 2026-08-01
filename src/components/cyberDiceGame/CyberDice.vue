<script setup lang="ts">
import { ref, nextTick } from 'vue'

// 3rd-party plugin imports
import draggable from 'vuedraggable'

// util imports
import { isMobile } from '@/utils/navigator.ts'

// composable imports
import { useKeyboardOpen } from '@/composables/useKeyboardOpen.ts'
import { useCyberDiceGame } from '@/composables/useCyberDiceGame.ts'
import { useFlashOverlay } from '@/composables/useFlashOverlay'

// type imports
import type { drawerTypes } from '@/types/drawerTypes.ts'

// component imports
import CyberText from '@/components/CyberText.vue'
import CyberTextFlow from '@/components/cyberDiceGame/CyberTextFlow.vue'
import DrawerComponent from '@/components/cyberDiceGame/DrawerComponent.vue'
import NextRoundScreen from '@/components/cyberDiceGame/NextRoundScreen.vue'
import GameOverScreen from '@/components/cyberDiceGame/GameOverScreen.vue'
import CyberDiceRules from '@/components/cyberDiceGame/CyberDiceRules.vue'
import ConfirmationModal from '@/components/cyberDiceGame/ConfirmationModal.vue'

// icon imports
import GearIcon from '@/components/icons/GearIcon.vue'
import EventHistory from '@/components/icons/EventHistory.vue'
import SquaresIcon from '@/components/icons/SquaresIcon.vue'
import UserMinus from '@/components/icons/UserMinus.vue'
import HelpIcon from '@/components/icons/HelpIcon.vue'

const isMobileDevice = isMobile()
const { keyboardOpen } = useKeyboardOpen()

const { flashing, flashRed } = useFlashOverlay()

const inputValue = ref<string>('')

const inputRef = ref<HTMLInputElement | null>(null)

const playerList = ref<HTMLElement | null>(null)

const dragging = ref(false)

const customRounds = ref<number | null>(null)

const customRoundsRef = ref<HTMLInputElement | null>(null)

const drawerOpen = ref(false)

const drawerType = ref<drawerTypes>(null)

const showRules = ref<boolean>(false)

const showConfirmation = ref(false)

const confirmationType = ref('')

const transition = ref<boolean>(false)

const showTransition = () => (transition.value = true)

const hideTransition = () => (transition.value = false)

const handlePlayerAdd = () => {
	addPlayer(inputValue.value)
	focusInput()
	nextTick(() => {
		inputValue.value = ''
		if (playerList.value) {
			playerList.value.scrollTop = playerList.value.scrollHeight
		}
	})
}

const handlePlayerRemove = (playerId: number) => {
	removePlayer(playerId)
	focusInput()
}

const handleChooseRounds = (number: number) => {
	chooseRounds(number)
	customRounds.value = null
}

const handleStartGame = () => {
	animateNextRound()
	startGame()
}

const handleRestartGame = () => {
	animateNextRound()
	restartGame()
}

const handleBackToSetup = () => {
	goBackToSetup()
	if (
		gameData.value.totalRounds !== 20 &&
		gameData.value.totalRounds !== 15 &&
		gameData.value.totalRounds !== 10
	) {
		customRounds.value = gameData.value.totalRounds
	}
}

const openDrawer = (type: drawerTypes) => {
	if (drawerOpen.value === true && drawerType.value !== type) {
		drawerOpen.value = false
		setTimeout(() => {
			drawerOpen.value = true
			drawerType.value = type
		}, 200)
	} else {
		drawerOpen.value = true
		drawerType.value = type
	}
}

const closeDrawer = () => {
	drawerOpen.value = false
}

const toggleRules = () => {
	showRules.value = !showRules.value
}

const focusInput = () => {
	if (inputRef.value) {
		inputRef.value?.focus()
	}
}

const unfocusInput = () => {
	if (inputRef.value) {
		inputRef.value?.blur()
	}
}

const handleInput = (event: InputEvent) => {
	const target = event.target as HTMLInputElement
	// target.value = target.value.replace(/\s+/g, '-') // replace all spaces with dashes
	target.value = target.value.toLowerCase()
	inputValue.value = target.value
}

const blockInvalidChars = (e: KeyboardEvent) => {
	if (['e', 'E', '+', '-'].includes(e.key)) {
		e.preventDefault()
	}
}

const blurCustomRoundsInput = () => {
	customRoundsRef.value?.blur()
}

const chooseCustomRounds = () => {
	if (customRounds.value === null) {
		return
	}
	if (customRounds.value === 0) {
		customRounds.value = 1
	}
	if (customRounds.value > 99) {
		customRounds.value = 99
	}
	if (customRounds.value > 0) {
		if (
			customRounds.value === 10 ||
			customRounds.value === 15 ||
			customRounds.value === 20
		) {
			gameData.value.totalRounds = customRounds.value
			customRounds.value = null
			blurCustomRoundsInput()
		} else gameData.value.totalRounds = customRounds.value
	}
}

const handleShowConfirmation = (type: string) => {
	confirmationType.value = type
	showConfirmation.value = true
}

const handleConfirmConfirmation = (type: string) => {
	showConfirmation.value = false
	if (type === 'restart') {
		handleRestartGame()
	} else if (type === 'setup') {
		handleBackToSetup()
	} else if (type === 'quit') {
		quitGame()
	}
}

const animateBadSeven = () => {
	flashRed(200)
}

const animateNextRound = () => {
	showTransition()

	closeDrawer()

	setTimeout(() => {
		hideTransition()
	}, 1200)
}

const {
	gameData,
	playersStillIn,
	playerRankings,
	playersSortedByStatus,
	eventHistoryReversed,
	addPlayer,
	removePlayer,
	advanceStep,
	backStep,
	chooseRounds,
	startGame,
	restartGame,
	goBackToSetup,
	quitGame,
	exitGame,
	markOut,
	handleNumberButton,
	undoEvent,
	onDragEnd,
} = useCyberDiceGame(
	dragging,
	showTransition,
	hideTransition,
	closeDrawer,
	animateNextRound,
	animateBadSeven,
	focusInput,
	unfocusInput,
)
</script>

<template>
	<main
		:class="isMobileDevice === false ? 'py-12' : ''"
		class="w-full max-w-100 justify-self-center h-dvh overflow-hidden py-2 px-6 pb-8 flex flex-col"
	>
		<div
			v-if="flashing"
			class="fixed inset-0 z-61 bg-red-400 opacity-80 pointer-events-none transition-opacity duration-200"
		></div>

		<Transition name="slide-right">
			<NextRoundScreen
				v-if="transition && gameData.gameOver === false"
				:current-round="gameData.currentRound"
				:is-mobile-device
			/>
		</Transition>

		<ConfirmationModal
			:show="showConfirmation"
			:type="confirmationType"
			@confirm="handleConfirmConfirmation($event)"
			@cancel="showConfirmation = false"
		/>

		<Transition name="slide-right">
			<GameOverScreen
				v-if="gameData.gameOver === true"
				:player-rankings="playerRankings"
				:is-mobile-device
				@restart-game="handleRestartGame"
				@go-back-to-setup="handleBackToSetup"
				@quit-game="quitGame"
			/>
		</Transition>

		<Transition name="slide-down">
			<CyberDiceRules
				:is-mobile-device
				:show-rules
				@close-rules="toggleRules"
			/>
		</Transition>

		<div
			v-if="gameData.started"
			id="cyber-dice-div"
			class="flex mb-23 flex-col max-w-85 h-full overflow-hidden justify-between items-center"
		>
			<div
				class="flex flex-col h-full w-full items-center overflow-hidden gap-y-2"
			>
				<div class="flex flex-row items-center justify-between w-full">
					<button
						@click="openDrawer('options')"
						@touchstart="() => {}"
						class="p-1 rounded group hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
					>
						<GearIcon
							class="size-11 p-2 fill-gray-500 group-active:fill-white"
						/>
					</button>
					<p class="self-center font-mono text-lg font-bold text-gray-400">
						round
						<span id="round-number" class="text-white">{{
							gameData.currentRound
						}}</span>
						of {{ gameData.totalRounds }}
					</p>
					<button
						@click="toggleRules"
						@touchstart="() => {}"
						class="p-1 rounded group hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
					>
						<HelpIcon
							class="size-11 p-2 fill-gray-500 group-active:fill-white"
						/>
					</button>
				</div>
				<CyberTextFlow
					:value="gameData.currentScore"
					size="text-7xl"
					text-margin="ml-2"
					type="font-mono"
					color1="text-cyan-300"
					color2="text-fuchsia-400"
					class="animate-pulseHeader"
				/>
				<div class="flex w-full flex-col h-full overflow-hidden gap-y-4">
					<div
						class="flex flex-row justify-center items-center min-h-10 gap-x-2"
					>
						<button
							v-if="gameData.eventHistory && gameData.eventHistory.length > 0"
							@click="openDrawer('eventHistory')"
							@touchstart="() => {}"
							class="p-1 rounded group hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
						>
							<EventHistory
								class="size-8 fill-gray-500 group-active:fill-white"
							/>
						</button>
						<p class="font-mono text-xl font-bold self-center text-gray-400">
							roll {{ gameData.currentRoundRolls.length + 1 }}
						</p>
					</div>
					<CyberText
						size="text-2xl"
						class="self-center animate-pulseHeader"
						text-margin="ml-[3px]"
						:value="`${
							gameData.players.find((p) => p.id === gameData.currentPlayerId)
								?.name
						}'s turn`"
					/>
					<div
						ref="scoreboard"
						id="scoreboard"
						key="scoreboard"
						class="border-y-2 border-gray-900/60 self-center max-h-fit w-full overflow-y-scroll scroll-smooth py-4 mt-4 flex flex-col gap-y-4 flex-1"
					>
						<transition-group>
							<div
								id="player-row"
								v-for="(player, index) in playerRankings"
								:key="player.id"
								:class="index % 2 === 1 ? 'bg-gray-900/70' : ''"
								class="flex flex-row rounded items-center min-h-15 max-h-15 mx-0.5 justify-between text-center px-1 transition-all duration-400"
							>
								<CyberText
									v-if="playerRankings[0]!.score === 0"
									size="text-xl"
									text-margin="ml-[3px]"
									:value="'- ' + player.name"
								/>
								<CyberText
									v-else
									size="text-xl"
									text-margin="ml-[3px]"
									:value="player.rank + ' ' + player.name"
								/>
								<div
									id="player-score-info"
									class="flex flex-col h-full gap-y-1.5 justify-center items-end self-stretch"
								>
									<p class="text-white font-mono text-lg font-bold">
										{{ player.score.toLocaleString() }}
									</p>
									<p
										v-if="index !== 0 && playerRankings[0]!.score !== 0"
										class="text-gray-500 font-mono font-bold"
									>
										{{
											(player.score - playerRankings[0]!.score).toLocaleString()
										}}
									</p>
								</div>
							</div>
						</transition-group>
					</div>
					<div
						id="floating-buttons"
						:class="isMobileDevice ? 'bottom-12' : ''"
						class="flex fixed bottom-8 left-0 flex-row gap-x-6 w-full items-center justify-center self-center"
					>
						<button
							name="enter-roll"
							@click="openDrawer('manualRoll')"
							@touchstart="() => {}"
							class="flex flex-row gap-x-3 items-center justify-center text-white text-lg font-bold bg-gray-950 max-w-40 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
						>
							<SquaresIcon class="size-6 fill-white" />
							enter roll
						</button>
						<button
							name="view-players"
							@click="openDrawer('players')"
							@touchstart="() => {}"
							class="flex flex-row gap-x-3 items-center justify-center text-white text-lg font-bold bg-gray-950 max-w-40 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
						>
							<UserMinus class="size-6 fill-white" />
							mark out
						</button>
					</div>
				</div>
			</div>

			<DrawerComponent
				:drawerOpen
				:drawerType
				:history-visible="
					gameData.eventHistory && gameData.eventHistory.length > 0
				"
				@close="closeDrawer"
				@open-other="openDrawer($event)"
			>
				<div
					v-if="drawerType === 'manualRoll'"
					class="flex justify-center max-w-85 py-4"
				>
					<div
						id="number-grid"
						class="flex flex-row flex-wrap w-full gap-4 justify-evenly"
					>
						<button
							@click="handleNumberButton(n)"
							@touchstart="() => {}"
							v-for="n in Array.from({ length: 11 }, (_, i) => i + 2)"
							:key="n"
							:value="n"
							:disabled="
								gameData.currentRoundRolls.length >= 3 && (n === 2 || n === 12)
							"
							:class="[
								gameData.currentRoundRolls.length < 3 && n === 7
									? 'border-lime-300 text-lime-300 active:border-lime-300 active:ring-lime-300'
									: gameData.currentRoundRolls.length >= 3 && n === 7
										? 'border-red-400 text-red-400 active:border-red-400 active:ring-red-400'
										: 'text-white border-white',
							]"
							class="rounded font-bold bg-gray-950 size-17 border-2 text-xl disabled:bg-none disabled:border-0 disabled:hover:bg-gray-900 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-default disabled:active:ring-0 font-mono flex items-center justify-center cursor-pointer hover:bg-gray-800 active:border-3 active:border-fuchsia-400 active:ring-3 active:ring-cyan-300"
						>
							{{ n }}
						</button>
						<button
							@click="handleNumberButton('doubles')"
							@touchstart="() => {}"
							value="doubles"
							:disabled="gameData.currentRoundRolls.length < 3"
							class="rounded font-semibold size-17 border-2 bg-gray-950 disabled:bg-none disabled:border-0 disabled:hover:bg-gray-900 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-default disabled:active:ring-0 text-lime-300 font-mono border-lime-300 flex items-center text-xs justify-center cursor-pointer hover:bg-gray-800 active:border-3 active:border-lime-300 active:ring-3 active:ring-lime-300"
						>
							<span class="rotate-45">doubles</span>
						</button>
					</div>
				</div>
				<div
					v-if="drawerType === 'eventHistory'"
					ref="event-history"
					id="event-history"
					key="history"
					class="border-y-2 border-gray-800/60 self-center w-full max-w-90 h-fit overflow-y-scroll scroll-smooth pt-4 pb-4 px-1 flex flex-col gap-y-2"
				>
					<transition-group name="event-history" tag="div">
						<div
							id="event-row"
							v-for="(event, index) in eventHistoryReversed"
							:key="event.id"
							:class="index % 2 === 1 ? 'bg-gray-900/70' : ''"
							class="event-row relative flex flex-row rounded items-center min-h-20 max-h-20 mx-0.5 justify-between text-center px-1 py-3"
						>
							<div class="flex flex-col gap-y-1 w-full items-start">
								<p
									:class="index === 0 ? 'text-gray-500' : 'text-gray-500/70'"
									class="font-bold font-mono text-lg"
								>
									round {{ event.round }} ·
									{{
										event.type === 'manualRoll'
											? `roll ${event.gameData.currentRoundRolls.length + 1}`
											: 'mark out'
									}}
								</p>
								<p
									:class="index === 0 ? 'text-white' : 'text-gray-400/70'"
									class="font-semibold font-mono text-lg"
								>
									{{
										event.type === 'manualRoll'
											? gameData.players.find((p) => p.id === event.playerId)
													?.name + ' rolled'
											: gameData.players.find((p) => p.id === event.playerId)
													?.name + ' went out'
									}}{{ event.rollValue ? ' ' + event.rollValue : '' }}
								</p>
							</div>

							<button
								v-if="index === 0"
								@click="undoEvent(event.id)"
								@touchstart="() => {}"
								class="rounded font-bold self-center cursor-pointer bg-none border-gray-500 text-gray-500 w-fit min-w-14 h-fit font-mono p-1.5 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300"
							>
								Undo
							</button>
						</div>
					</transition-group>
				</div>
				<div
					v-if="drawerType === 'players'"
					ref="playerList"
					id="player-list"
					key="players"
					class="border-y-2 border-gray-800/60 self-center w-full max-w-90 h-fit overflow-y-scroll scroll-smooth pt-4 pb-4 px-1 flex flex-col gap-y-2"
				>
					<transition-group>
						<div
							id="player-row"
							v-for="(player, index) in playersSortedByStatus"
							:key="player.id"
							:class="[
								index % 2 === 1 && !player.out ? 'bg-gray-900/70' : '',
								player.out ? 'bg-gray-800' : 'bg-none',
							]"
							class="flex flex-row rounded items-center min-h-15 max-h-15 mx-0.5 justify-between text-center px-1 transition-all duration-400"
						>
							<CyberText
								v-if="player.out === false"
								size="text-xl"
								text-margin="ml-[3px]"
								:value="player.name"
							/>
							<p
								v-else
								class="text-gray-600 self-center font-mono text-xl font-bold"
							>
								{{ player.name }}
							</p>
							<button
								v-if="!player.out"
								@click="markOut(player.id)"
								@touchstart="() => {}"
								:class="
									player.out
										? 'bg-gray-800 hover:bg-gray-700'
										: 'hover:bg-gray-800'
								"
								class="rounded font-bold self-center cursor-pointer bg-none border-gray-500 text-gray-500 w-fit min-w-22 h-fit font-mono p-1 py-2 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300"
							>
								mark out
							</button>
							<p v-else class="min-w-22 font-mono font-bold text-gray-600">
								Out
							</p>
						</div>
					</transition-group>
				</div>
				<div
					v-if="drawerType === 'options'"
					class="flex flex-col w-full pt-3 pb-6 max-w-85 gap-y-7"
				>
					<button
						name="restart-game-button"
						@click="handleShowConfirmation('restart')"
						@touchstart="() => {}"
						class="text-white text-xl font-bold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						restart game
					</button>
					<button
						name="back-to-setup-button"
						@click="handleShowConfirmation('setup')"
						@touchstart="() => {}"
						class="text-white text-xl font-bold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						change setup
					</button>
					<button
						name="quit-game-button"
						@click="handleShowConfirmation('quit')"
						@touchstart="() => {}"
						class="text-xl font-bold bg-gray-950 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-800 active:border-2 text-red-400 active:border-red-400 active:ring-red-400 active:ring-2"
					>
						quit game
					</button>
				</div>
			</DrawerComponent>
		</div>
		<div
			v-else
			class="flex flex-col gap-y-8 w-full self-center overflow-y-hidden"
		>
			<div
				v-if="gameData.setupStep === 0"
				id="title-page"
				:class="isMobileDevice === false ? '-mt-12' : ''"
				class="flex flex-col h-dvh items-center justify-center text-center px-1"
			>
				<CyberText
					:value="'cyber dice'"
					size="text-7xl"
					text-margin="ml-[6px]"
					type="font-mono"
					color1="text-cyan-300"
					color2="text-fuchsia-400"
					class="animate-pulseHeader"
				/>
				<p class="font-mono text-2xl text-gray-500 mt-10">
					ready to see who's lucky?
				</p>
				<div id="start-page-buttons" class="mt-15 flex flex-col w-full gap-y-7">
					<button
						name="start-setup"
						@click="advanceStep"
						@touchstart="() => {}"
						class="text-white text-xl font-bold bg-gray-950 rounded border-white w-full max-w-85 min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-900 active:text-white active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						new game
					</button>
					<button
						name="see-rules"
						@click="toggleRules"
						@touchstart="() => {}"
						class="text-white text-xl font-bold bg-gray-950 rounded border-white w-full max-w-85 min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-900 active:text-white active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						see rules
					</button>
					<button
						name="exit-game"
						@click="exitGame"
						@touchstart="() => {}"
						class="text-red-400 text-xl font-bold bg-gray-950 rounded border-red-400 w-full min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-900 active:border-2 active:text-red-400 active:border-red-400 active:ring-red-400 active:ring-2"
					>
						exit game
					</button>
				</div>
			</div>
			<template v-else>
				<div
					id="setup-header"
					class="flex flex-row justify-between items-center"
				>
					<button
						id="quit-game-setup-button"
						v-if="gameData.setupStep === 1"
						@click="
							gameData.players.length > 0
								? handleShowConfirmation('quit')
								: quitGame()
						"
						@touchstart="() => {}"
						class="py-2 px-3 rounded group hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
					>
						<span class="font-mono text-3xl mb-2 text-gray-500">x</span>
					</button>
					<button
						id="go-back-setup-button"
						v-if="gameData.setupStep === 2"
						@click="backStep"
						@touchstart="() => {}"
						class="py-2 px-3 rounded group hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
					>
						<span class="font-mono text-3xl text-gray-500">&lt;</span>
					</button>
					<p
						v-if="gameData.setupStep === 1"
						class="text-center font-mono text-xl text-white"
					>
						who's playing?
					</p>
					<button
						v-if="playersStillIn.length > 1 && gameData.setupStep === 1"
						id="next-step-button"
						name="next-step"
						@click="advanceStep"
						@touchstart="() => {}"
						class="py-2 px-3 rounded group hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
					>
						<span class="font-mono text-3xl text-gray-500">></span>
					</button>
					<div
						v-if="playersStillIn.length < 2"
						class="size-10.5 invisible"
					></div>
					<p
						v-if="gameData.setupStep === 2"
						class="text-center font-mono text-xl text-white"
					>
						how many rounds?
					</p>
					<div v-if="gameData.setupStep === 2" class="size-7 invisible"></div>
				</div>
				<div
					v-if="gameData.setupStep === 1"
					id="step-1"
					class="flex flex-col gap-y-5 max-h-full overflow-auto"
				>
					<div class="flex flex-row gap-4 py-1 mx-0.5">
						<input
							ref="inputRef"
							@keydown.enter="handlePlayerAdd"
							placeholder="enter player name"
							name="enter-name"
							autocomplete="off"
							@input="handleInput($event)"
							v-model="inputValue"
							class="self-center text-lg placeholder:text-gray-500 w-full rounded bg-gray-900 text-white font-mono tracking-wide px-3 min-h-12 focus:px-2.5 outline-0 focus:ring-2 focus:ring-cyan-300 focus:border-2 focus:border-fuchsia-400"
						/>
						<button
							name="add-player"
							@click="handlePlayerAdd"
							@touchstart="() => {}"
							class="text-white bg-gray-950 rounded w-fit px-3 min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
						>
							add
						</button>
					</div>
					<p
						v-if="playersStillIn.length < 2"
						class="font-mono -mt-3 text-gray-500"
					>
						add at least 2 players
					</p>
					<div
						v-if="playersStillIn.length !== 0"
						ref="playerList"
						id="add-player-list"
						:class="keyboardOpen === true ? 'max-h-[29dvh]' : ''"
						class="border-y-2 border-gray-900 self-center w-full h-fit overflow-y-scroll scroll-smooth py-2 flex flex-col gap-y-2"
					>
						<draggable
							v-model="gameData.players"
							handle=".drag-handle"
							ghost-class="ghost"
							@start="dragging = true"
							@end="onDragEnd"
							item-key="id"
						>
							<template #item="{ element, index }">
								<div
									id="player-row"
									:key="element.id"
									class="flex flex-row bg-gray-950 min-h-15 max-h-15 mx-0.5 justify-between text-center"
								>
									<div
										id="grabber-and-text"
										class="flex flex-row items-center gap-x-4"
									>
										<span
											class="drag-handle cursor-grab active:cursor-grabbing font-mono text-2xl text-gray-500"
											>⌘</span
										>
										<CyberText
											class="self-center"
											size="text-xl"
											text-margin="ml-[3px]"
											:value="index + 1 + '.   ' + element.name"
										/>
									</div>
									<button
										@click="handlePlayerRemove(element.id)"
										@touchstart="() => {}"
										class="rounded font-bold self-center cursor-pointer bg-gray-950 border-gray-500 text-gray-500 w-fit h-fit font-mono p-1.5 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300"
									>
										remove
									</button>
								</div>
							</template>
						</draggable>
					</div>
				</div>
				<div
					v-if="gameData.setupStep === 2"
					id="step-2"
					class="flex flex-col gap-y-5 h-full pb-1 mt-1"
				>
					<div id="select-rounds" class="flex flex-col gap-y-5 h-full px-1">
						<input
							id="20-rounds"
							type="radio"
							v-model="gameData.totalRounds"
							:value="20"
							@click="handleChooseRounds(20)"
							@keydown.enter="handleChooseRounds(20)"
							name="how-many-rounds"
							class="self-center hidden peer/20-rounds"
						/>
						<label
							for="20-rounds"
							:class="
								customRounds !== null
									? 'border-gray-500 text-gray-500'
									: 'peer-checked/20-rounds:text-white peer-checked/20-rounds:border-3 peer-checked/20-rounds:border-fuchsia-400 peer-checked/20-rounds:ring-3 peer-checked/20-rounds:ring-cyan-300'
							"
							class="text-gray-500 text-xl font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white"
							>20 rounds
						</label>
						<input
							id="15-rounds"
							type="radio"
							v-model="gameData.totalRounds"
							:value="15"
							@click="handleChooseRounds(15)"
							@keydown.enter="handleChooseRounds(15)"
							name="how-many-rounds"
							class="self-center hidden peer/15-rounds"
						/>
						<label
							for="15-rounds"
							:class="
								customRounds !== null
									? 'border-gray-500 text-gray-500'
									: 'peer-checked/15-rounds:text-white peer-checked/15-rounds:border-3 peer-checked/15-rounds:border-fuchsia-400 peer-checked/15-rounds:ring-3 peer-checked/15-rounds:ring-cyan-300'
							"
							class="text-gray-500 text-xl font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white"
							>15 rounds
						</label>
						<input
							id="10-rounds"
							type="radio"
							v-model="gameData.totalRounds"
							:value="10"
							@click="handleChooseRounds(10)"
							@keydown.enter="handleChooseRounds(10)"
							name="how-many-rounds"
							class="self-center hidden peer/10-rounds"
						/>
						<label
							for="10-rounds"
							:class="
								customRounds !== null
									? 'border-gray-500 text-gray-500'
									: 'peer-checked/10-rounds:text-white peer-checked/10-rounds:border-3 peer-checked/10-rounds:border-fuchsia-400 peer-checked/10-rounds:ring-3 peer-checked/10-rounds:ring-cyan-300'
							"
							class="font-mono text-xl rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 text-gray-500 hover:bg-gray-800 hover:text-white"
							>10 rounds
						</label>
						<p class="text-gray-400 text-center text-xl font-mono font-bold">
							or
						</p>
						<input
							id="custom-rounds"
							ref="customRoundsRef"
							type="number"
							min="1"
							max="99"
							placeholder="enter custom amount"
							name="custom-rounds"
							autocomplete="off"
							@keydown="blockInvalidChars"
							@input="chooseCustomRounds"
							@keydown.enter="blurCustomRoundsInput"
							v-model="customRounds"
							:class="
								customRounds !== null && customRounds > 0
									? 'ring-2 border-2 ring-cyan-300 border-fuchsia-400'
									: 'border-gray-500'
							"
							class="self-center text-xl text-center placeholder:text-gray-500 w-full rounded bg-transparent border-2 focus:bg-gray-900 text-white font-mono tracking-wide px-3 h-20 focus:px-2.5 outline-0 focus:ring-2 focus:ring-cyan-300 focus:border-2 focus:border-fuchsia-400"
						/>
					</div>
					<button
						name="start-game"
						@click="handleStartGame"
						@touchstart="() => {}"
						class="text-white text-xl font-semibold bg-gray-950 mt-10 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						start game
					</button>
				</div>
			</template>
		</div>
	</main>
</template>

<style>
button,
p,
h1,
h2,
h3 {
	-webkit-user-select: none;
	user-select: none;
}

.slide-right-enter-from {
	transform: translateX(100%);
}

.slide-right-enter-to {
	transform: translateX(0);
}

.slide-right-leave-from {
	transform: translateX(0);
}

.slide-right-leave-to {
	transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
	transition: transform 200ms ease-out;
}

.slide-down-enter-from {
	transform: translateY(-100%);
}

.slide-down-enter-to {
	transform: translateY(0);
}

.slide-down-leave-from {
	transform: translateY(0);
}

.slide-down-leave-to {
	transform: translateY(-100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
	transition: transform 200ms ease-out;
}

.ghost {
	opacity: 0.9;
	background: #101828;
}

.event-history-enter-active,
.event-history-leave-active,
.event-history-move {
	transition:
		opacity 100ms ease,
		transform 300ms ease;
}

.event-history-enter-from,
.event-history-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

.event-history-enter-to,
.event-history-leave-from {
	opacity: 1;
	transform: translateY(0);
}

.event-row {
	will-change: transform, opacity;
}

.event-history-move {
	transition: transform 200ms ease;
}

.event-history-enter-active,
.event-history-leave-active {
	transition:
		opacity 100ms ease,
		transform 300ms ease;
}

.event-history-enter-from,
.event-history-leave-to {
	opacity: 0;
	transform: translateY(8px);
}

.event-history-leave-active {
	position: absolute;
	width: 85%;
}
</style>
