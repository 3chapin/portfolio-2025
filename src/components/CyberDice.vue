<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { updateStorage } from '@/composables/storageUtils'
import CyberText from './CyberText.vue'
import CyberTextFlow from './CyberTextFlow.vue'
import CloseX from './icons/CloseX.vue'
import GearIcon from './icons/GearIcon.vue'
import PlusIcon from './icons/PlusIcon.vue'
import BackArrow from './icons/BackArrow.vue'
import DrawerComponent from './DrawerComponent.vue'
import { isMobile } from '@/composables/navigator'
import NextRoundScreen from './NextRoundScreen.vue'
import GameOverScreen from './GameOverScreen.vue'
import { setThemeColor } from '@/utils/setThemeColor'

const isMobileDevice = isMobile.value

type Player = {
	id: number
	name: string
	score: number
	out: boolean
}

// just used for testing
// const defaultPlayers = ref<Player[]>([
// 	{ id: 1, name: 'Kevin', score: 0, out: false },
// 	{ id: 2, name: 'Carol', score: 0, out: false },
// 	{ id: 3, name: 'Jacob', score: 0, out: false },
// 	{ id: 4, name: 'Jenny', score: 0, out: false },
// 	{ id: 5, name: 'Joseph', score: 0, out: false },
// 	{ id: 6, name: 'Sarah', score: 0, out: false },
// 	{ id: 7, name: 'Bryce', score: 0, out: false },
// 	{ id: 8, name: 'Jonathan', score: 0, out: false },
// 	{ id: 9, name: 'Jennifer', score: 0, out: false },
// 	{ id: 10, name: 'Ben', score: 0, out: false },
// 	{ id: 11, name: 'Holly', score: 0, out: false },
// 	{ id: 12, name: 'Dave', score: 0, out: false },
// 	{ id: 13, name: 'Kirsten', score: 0, out: false },
// 	{ id: 14, name: 'Michael', score: 0, out: false },
// 	{ id: 15, name: 'Hannah', score: 0, out: false },
// 	{ id: 16, name: 'Sasha', score: 0, out: false },
// 	{ id: 17, name: 'Jared', score: 0, out: false },
// ])

type GameData = {
	setupStep: number
	players: Player[]
	totalRounds: number
	started: boolean
	gameOver: boolean
	currentRound: number
	currentScore: number
	currentPlayerId: number | null
	currentRoundRolls: { playerId: number; rollValue: number | string }[]
}

const defaultGameData: GameData = {
	setupStep: 1,

	// Just used for testing
	// players: defaultPlayers.value,

	players: [] as Player[],
	totalRounds: 20,
	started: false,
	gameOver: false,
	currentRound: 1,
	currentScore: 0,
	currentPlayerId: null,
	currentRoundRolls: [],
}

const gameData = ref<GameData>(defaultGameData)

const playersStillIn = computed<Player[]>(() => {
	return gameData.value.players.filter((p) => !p.out)
})

const currentPlayerFullIndex = computed(() => {
	return gameData.value.players.findIndex(
		(p) => p.id === gameData.value.currentPlayerId,
	)
})

// const playersSortedByScore = computed<Player[]>(() => {
// 	return [...gameData.value.players].sort((a, b) => b.score - a.score)
// })

const playerRankings = computed(() => {
	const sorted = [...gameData.value.players].sort((a, b) => b.score - a.score)
	let lastScore: number | null = null
	let lastRank = 0

	return sorted.map((player, idx) => {
		if (player.score !== lastScore) {
			lastRank = idx + 1
			lastScore = player.score
		}
		return { ...player, rank: lastRank }
	})
})

const playersSortedByStatus = computed<Player[]>(() => {
	return [...gameData.value.players].sort((a, b) => {
		if (b.out !== a.out) {
			return a.out ? 1 : -1
		}
		return 0
	})
})

const router = useRouter()

const inputValue = ref<string>('')

const inputRef = ref<HTMLInputElement | null>(null)

const playerList = ref<HTMLElement | null>(null)

const drawerOpen = ref(false)

const drawerType = ref<string>('')

const showTransition = ref<boolean>(false)

const openDrawer = (type: string) => {
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

const focusInput = () => {
	if (inputRef.value) {
		inputRef.value?.focus()
	}
}

const generateId = () => {
	return Math.floor(Math.random() * 100000000)
}

const addPlayer = () => {
	if (inputValue.value !== '') {
		gameData.value.players.push({
			id: generateId(),
			name: inputValue.value.trim(),
			score: 0,
			out: false,
		})
		inputValue.value = ''
		focusInput()
		nextTick(() => {
			if (playerList.value) {
				playerList.value.scrollTop = playerList.value.scrollHeight
			}
		})
	}
}

const removePlayer = (id: number) => {
	const index = gameData.value.players.findIndex((p) => p.id === id)
	if (index !== -1) {
		gameData.value.players.splice(index, 1)
	}
	focusInput()
}

const advanceStep = () => {
	gameData.value.setupStep++
}

const backStep = () => {
	gameData.value.setupStep--
}

const chooseRounds = (number: number) => {
	gameData.value.totalRounds = number
}

const startGame = () => {
	animateNextRound()

	setTimeout(() => {
		gameData.value.started = true
		if (
			gameData.value.players.length > 0 &&
			gameData.value.players[0] !== undefined
		) {
			gameData.value.currentPlayerId = gameData.value.players[0].id
		}
	}, 200)
}

const quitGame = () => {
	gameData.value = defaultGameData
	localStorage.removeItem('gameData')
	router.push('/')
}

const restartGame = () => {
	animateNextRound()

	setTimeout(() => {
		gameData.value.currentPlayerId = gameData.value.players[0]?.id || null
		gameData.value.currentRound = 1
		gameData.value.currentRoundRolls = []
		gameData.value.currentScore = 0
		gameData.value.gameOver = false
		gameData.value.started = true
		gameData.value.players.forEach((p) => {
			p.score = 0
			p.out = false
		})
	}, 200)
}

const goBackToSetup = () => {
	gameData.value.setupStep = 1
	gameData.value.currentPlayerId = gameData.value.players[0]?.id || null
	gameData.value.currentRound = 1
	gameData.value.currentRoundRolls = []
	gameData.value.currentScore = 0
	gameData.value.gameOver = false
	gameData.value.started = false
	gameData.value.players.forEach((p) => {
		p.score = 0
		p.out = false
	})
}

const markOut = (id: number) => {
	const playerToGoOut = gameData.value.players.find((p) => p.id === id)
	if (!playerToGoOut) return

	const wasCurrentPlayer = playerToGoOut.id === gameData.value.currentPlayerId

	playerToGoOut.score += gameData.value.currentScore
	playerToGoOut.out = true

	if (wasCurrentPlayer) {
		nextPlayer()
	}

	if (playersStillIn.value.length === 0) {
		endRound()
	}
}

// function undoMarkOut(id) {}

const endRound = () => {
	gameData.value.currentScore = 0
	gameData.value.currentRound++
	gameData.value.currentRoundRolls = []
	gameData.value.players.forEach((player) => {
		player.out = false
	})

	setTimeout(animateNextRound, 250)
}

const animateBadSeven = () => {
	const flashScreen = document.getElementById('flash-overlay')
	if (flashScreen) {
		flashScreen.classList.add('red-flash')
		setTimeout(() => flashScreen.classList.remove('red-flash'), 200)
		setTimeout(() => setThemeColor('#18181b'), 250)
	}
}

const animateNextRound = () => {
	showTransition.value = true

	closeDrawer()

	setTimeout(() => {
		showTransition.value = false
	}, 1500)
}

const handleNumberButton = (value: number | string) => {
	let newRollValue: string | number | null = null
	if (value === 'doubles') {
		newRollValue = value
	} else {
		newRollValue = value
	}
	const playerWhoRolled = gameData.value.players.find(
		(p) => p.id === gameData.value.currentPlayerId,
	)
	if (playerWhoRolled) {
		gameData.value.currentRoundRolls.push({
			playerId: playerWhoRolled.id,
			rollValue: newRollValue,
		})
	}

	nextPlayer()

	if (gameData.value.currentRoundRolls.length <= 3) {
		if (newRollValue !== 7 && typeof newRollValue === 'number') {
			gameData.value.currentScore = gameData.value.currentScore + newRollValue
		} else {
			gameData.value.currentScore = gameData.value.currentScore + 70
		}
	} else {
		if (newRollValue === 7) {
			if (gameData.value.currentRound < gameData.value.totalRounds) {
				//end round
				endRound()
				animateBadSeven()
			} else {
				//end Game
				gameData.value.gameOver = true
				showTransition.value = true
			}
		} else if (newRollValue === 'doubles') {
			//double score - rolled doubles
			gameData.value.currentScore = gameData.value.currentScore * 2
		} else if (typeof newRollValue === 'number') {
			//normal addition
			gameData.value.currentScore = gameData.value.currentScore + newRollValue
		}
	}
}

const nextPlayer = () => {
	const players = gameData.value.players
	const total = players.length

	if (!total || gameData.value.currentPlayerId === null) return

	const startIndex = currentPlayerFullIndex.value

	for (let step = 1; step <= total; step++) {
		const index = (startIndex + step) % total
		const candidate = players[index]

		if (playersStillIn.value.length === 0 && candidate !== undefined) {
			gameData.value.currentPlayerId = candidate.id
			return
		}

		if (candidate !== undefined && !candidate.out) {
			gameData.value.currentPlayerId = candidate.id
			return
		}
	}
}

watch(
	gameData,
	() => {
		updateStorage(localStorage, 'gameData', JSON.stringify(gameData.value))
	},
	{ deep: true },
)

onMounted(() => {
	const savedGameData = localStorage.getItem('gameData')
	if (savedGameData) {
		gameData.value = JSON.parse(savedGameData)
	}
	focusInput()
})
</script>

<template>
	<main
		:class="isMobileDevice === false ? 'py-12' : ''"
		class="w-full max-w-100 justify-self-center h-dvh overflow-hidden py-2 px-6 pb-8 flex flex-col"
	>
		<div id="flash-overlay" class="z-60"></div>

		<Transition name="slide-right">
			<NextRoundScreen
				v-if="showTransition && gameData.gameOver === false"
				:current-round="gameData.currentRound"
				:is-mobile-device
			/>
		</Transition>

		<Transition name="slide-right">
			<GameOverScreen
				v-if="gameData.gameOver === true"
				:player-rankings="playerRankings"
				:is-mobile-device
				@restart-game="restartGame"
				@go-back-to-setup="goBackToSetup"
				@quit-game="quitGame"
			/>
		</Transition>

		<div
			v-if="gameData.started"
			id="cyber-dice-div"
			:class="isMobileDevice === false ? 'mb-22' : ''"
			class="flex mb-17 flex-col max-w-85 h-full overflow-hidden justify-between items-center"
		>
			<div
				class="flex flex-col h-full w-full items-center overflow-hidden gap-y-2"
			>
				<div class="flex flex-row items-center justify-between w-full">
					<GearIcon
						@click="openDrawer('options')"
						@touchstart="() => {}"
						class="size-7 stroke-gray-500 active:stroke-white cursor-pointer"
					/>
					<p class="self-center font-mono font-medium text-gray-400">
						Round
						<span id="round-number" class="text-white">{{
							gameData.currentRound
						}}</span>
						of {{ gameData.totalRounds }}
					</p>
					<div class="invisible size-7"></div>
				</div>
				<CyberTextFlow
					:value="gameData.currentScore"
					size="text-6xl"
					text-margin="ml-2"
					type="font-mono"
					color1="text-cyan-300"
					color2="text-fuchsia-400"
					class="animate-pulseHeader"
				/>
				<div class="flex w-full flex-col h-full overflow-hidden gap-y-4">
					<p class="font-mono font-medium self-center text-gray-400">
						Roll {{ gameData.currentRoundRolls.length + 1 }}
					</p>
					<CyberText
						class="self-center animate-pulseHeader"
						text-margin="ml-[3px]"
						size="text-xl"
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
								class="flex flex-row rounded items-center min-h-14 max-h-14 mx-0.5 justify-between text-center px-3 transition-all duration-400"
							>
								<CyberText
									text-margin="ml-[3px]"
									:value="player.rank + ' ' + player.name"
								/>
								<div
									id="player-score-info"
									class="flex flex-col h-full gap-y-1.5 justify-center items-end self-stretch"
								>
									<p class="text-white font-mono text-base">
										{{ player.score.toLocaleString() }}
									</p>
									<p
										v-if="index !== 0 && playerRankings[0]!.score !== 0"
										class="text-gray-600 font-mono text-sm"
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
						:class="isMobileDevice === false ? 'bottom-12' : ''"
						class="flex fixed bottom-8 flex-row gap-x-6 w-full items-center justify-center self-center"
					>
						<button
							name="enter-roll"
							@click="openDrawer('manualRoll')"
							@touchstart="() => {}"
							class="text-white font-semibold bg-gray-950 max-w-40 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
						>
							Enter Roll
						</button>
						<button
							name="view-players"
							@click="openDrawer('players')"
							@touchstart="() => {}"
							class="text-white font-semibold bg-gray-950 max-w-40 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
						>
							Mark Out
						</button>
					</div>
				</div>
			</div>
			<DrawerComponent
				:drawerOpen
				:drawerType
				@close="closeDrawer"
				@open-other="openDrawer"
			>
				<div
					v-if="drawerType === 'manualRoll'"
					class="flex justify-center max-w-85 py-4"
				>
					<div class="flex flex-row flex-wrap w-full gap-5 justify-evenly">
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
							class="rounded font-semibold bg-gray-950 size-17 border-2 text-lg disabled:bg-none disabled:border-0 disabled:hover:bg-gray-900 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-default disabled:active:ring-0 font-mono flex items-center justify-center cursor-pointer hover:bg-gray-800 active:border-3 active:border-fuchsia-400 active:ring-3 active:ring-cyan-300"
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
							<span class="rotate-45">Doubles</span>
						</button>
					</div>
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
							class="flex flex-row rounded items-center min-h-14 max-h-14 mx-0.5 justify-between text-center px-3 transition-all duration-400"
						>
							<CyberText
								v-if="player.out === false"
								text-margin="ml-[3px]"
								:value="player.name"
							/>
							<p v-else class="text-gray-600 self-center font-mono">
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
								class="rounded font-semibold self-center cursor-pointer text-sm bg-none border-gray-500 text-gray-500 w-fit min-w-22 h-fit font-mono p-1 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300"
							>
								Mark Out
							</button>
							<p v-else class="min-w-22 font-mono text-gray-600">Out</p>
						</div>
					</transition-group>
				</div>
				<div
					v-if="drawerType === 'options'"
					class="flex flex-col w-full pt-3 pb-6 max-w-85 gap-y-7"
				>
					<button
						name="play-again"
						@click="restartGame"
						@touchstart="() => {}"
						class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						Restart Game (Same Setup)
					</button>
					<button
						name="back-to-setup"
						@click="goBackToSetup"
						@touchstart="() => {}"
						class="text-white font-semibold bg-gray-950 px-3 w-full rounded min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						Restart Game (Change Setup)
					</button>
					<button
						name="quit-game"
						@click="quitGame"
						@touchstart="() => {}"
						class="font-semibold bg-gray-950 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 hover:bg-gray-800 active:border-2border-red-400 text-red-400 active:border-red-400 active:ring-red-400 active:ring-2"
					>
						Quit Game
					</button>
				</div>
			</DrawerComponent>
		</div>
		<div
			v-else
			class="flex flex-col gap-y-8 w-full self-center overflow-y-hidden"
		>
			<div
				id="setup-header"
				class="flex flex-row justify-between items-center mb-3"
			>
				<CloseX
					v-if="gameData.setupStep === 1"
					@click="quitGame"
					@touchstart="() => {}"
					class="stroke-gray-500 size-7 cursor-pointer active:stroke-white"
				/>
				<BackArrow
					v-if="gameData.setupStep === 2"
					@click="backStep"
					@touchstart="() => {}"
					class="stroke-gray-500 size-7 cursor-pointer active:stroke-white"
				/>
				<p
					v-if="gameData.setupStep === 1"
					class="text-center font-mono font-medium text-white"
				>
					Who's playing?
				</p>
				<button
					v-if="playersStillIn.length > 1 && gameData.setupStep === 1"
					name="next-step"
					@click="advanceStep"
					@touchstart="() => {}"
					class="text-white font-semibold bg-gray-950 rounded p-1 -ml-4 text-sm self-center font-mono cursor-pointer hover:bg-gray-800 active:bg-gray-900"
				>
					Next
				</button>
				<div v-if="playersStillIn.length < 2" class="size-7 invisible"></div>
				<p
					v-if="gameData.setupStep === 2"
					class="text-center font-mono font-medium text-white"
				>
					How many rounds?
				</p>
				<div v-if="gameData.setupStep === 2" class="size-7 invisible"></div>
			</div>
			<div
				v-if="gameData.setupStep === 1"
				id="step-1"
				class="flex flex-col gap-y-5 overflow-y-hidden"
			>
				<div class="flex flex-row gap-4 py-1 mx-0.5">
					<input
						ref="inputRef"
						@keydown.enter="addPlayer"
						placeholder="Enter player name"
						name="enter-name"
						autocomplete="off"
						v-model="inputValue"
						class="self-center placeholder:text-gray-500 w-full rounded bg-gray-900 text-white font-mono tracking-wide px-3 min-h-12 focus:px-2.5 outline-0 focus:ring-2 focus:ring-cyan-300 focus:border-2 focus:border-fuchsia-400"
					/>
					<button
						name="add-player"
						@click="addPlayer"
						@touchstart="() => {}"
						class="text-white bg-gray-950 rounded w-fit px-3 min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
					>
						<PlusIcon class="size-1 stroke-2" />
					</button>
				</div>
				<p
					v-if="playersStillIn.length < 2"
					class="font-mono text-xs -mt-3 text-gray-500"
				>
					Add at least 2 players
				</p>
				<div
					v-if="playersStillIn.length !== 0"
					ref="playerList"
					id="player-list"
					class="border-y-2 border-gray-900 self-center w-full h-fit overflow-y-scroll scroll-smooth py-2 flex flex-col gap-y-2"
				>
					<div
						id="player-row"
						v-for="(player, index) in playersStillIn"
						:key="player.id"
						class="flex flex-row min-h-14 max-h-14 mx-0.5 justify-between text-center"
					>
						<CyberText
							class="self-center"
							text-margin="ml-[3px]"
							:value="index + 1 + '.   ' + player.name"
						/>
						<button
							@click="removePlayer(player.id)"
							@touchstart="() => {}"
							class="rounded font-semibold self-center cursor-pointer text-sm bg-gray-950 border-gray-500 text-gray-500 w-fit h-fit font-mono p-1 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300"
						>
							Remove
						</button>
					</div>
				</div>
			</div>
			<div
				v-if="gameData.setupStep === 2"
				id="step-2"
				class="flex flex-col gap-y-5 h-full px-1 pb-1"
			>
				<input
					id="20-rounds"
					type="radio"
					@click="chooseRounds(20)"
					@keydown.enter="chooseRounds(20)"
					checked
					name="how-many-rounds"
					class="self-center hidden peer/20-rounds"
				/>
				<label
					for="20-rounds"
					class="text-gray-500 font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white peer-checked/20-rounds:text-white peer-checked/20-rounds:border-3 peer-checked/20-rounds:border-fuchsia-400 peer-checked/20-rounds:ring-3 peer-checked/20-rounds:ring-cyan-300"
					>20 Rounds
				</label>
				<input
					id="15-rounds"
					type="radio"
					@click="chooseRounds(15)"
					@keydown.enter="chooseRounds(15)"
					name="how-many-rounds"
					class="self-center hidden peer/15-rounds"
				/>
				<label
					for="15-rounds"
					class="text-gray-500 font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white peer-checked/15-rounds:text-white peer-checked/15-rounds:border-3 peer-checked/15-rounds:border-fuchsia-400 peer-checked/15-rounds:ring-3 peer-checked/15-rounds:ring-cyan-300"
					>15 Rounds
				</label>
				<input
					id="10-rounds"
					type="radio"
					@click="chooseRounds(10)"
					@keydown.enter="chooseRounds(10)"
					name="how-many-rounds"
					class="self-center hidden peer/10-rounds"
				/>
				<label
					for="10-rounds"
					class="text-gray-500 font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white peer-checked/10-rounds:text-white peer-checked/10-rounds:border-3 peer-checked/10-rounds:border-fuchsia-400 peer-checked/10-rounds:ring-3 peer-checked/10-rounds:ring-cyan-300"
					>10 Rounds
				</label>
				<button
					name="start-game"
					@click="startGame"
					@touchstart="() => {}"
					class="text-white font-semibold bg-gray-950 mt-10 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300"
				>
					Start Game
				</button>
			</div>
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

.red-flash {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #ff6367;
	opacity: 0.5;
	pointer-events: none;
	transition: opacity 0.2s ease-in-out;
	visibility: visible;
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
	transition: transform 300ms ease-out;
}
</style>
