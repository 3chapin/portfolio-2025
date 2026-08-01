import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { type GameData } from '@/types/gameData.ts'
import { createDefaultGameData } from '@/utils/createDefaultGameData'
import { type Player } from '@/types/player.ts'
import { updateStorage } from '@/utils/storageUtils.ts'
import { type Event } from '@/types/event.ts'
import { generateId } from '@/utils/generateId.ts'
import { useRouter } from 'vue-router'

export const useCyberDiceGame = (
	dragging: { value: boolean },
	showTransition: () => void,
	hideTransition: () => void,
	closeDrawer: () => void,
	animateNextRound: () => void,
	animateBadSeven: () => void,
	focusInput: () => void,
	unfocusInput: () => void,
) => {
	const router = useRouter()

	const gameData = ref<GameData>(createDefaultGameData())

	const playersStillIn = computed<Player[]>(() => {
		return gameData.value.players.filter((p) => !p.out)
	})

	const currentPlayerFullIndex = computed(() => {
		return gameData.value.players.findIndex(
			(p) => p.id === gameData.value.currentPlayerId,
		)
	})

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

	const eventHistoryReversed = computed(() => {
		return [...(gameData.value.eventHistory ?? [])].reverse()
	})

	const addPlayer = (playerName: string) => {
		if (playerName !== '') {
			gameData.value.players.push({
				id: generateId(),
				name: playerName.trim(),
				score: 0,
				out: false,
			})
		}
	}

	const removePlayer = (id: number) => {
		const index = gameData.value.players.findIndex((p) => p.id === id)
		if (index !== -1) {
			gameData.value.players.splice(index, 1)
		}
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

	const restartGame = () => {
		setTimeout(() => {
			gameData.value.currentPlayerId = gameData.value.players[0]?.id || null
			gameData.value.currentRound = 1
			gameData.value.currentRoundRolls = []
			gameData.value.eventHistory = []
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
		gameData.value.eventHistory = []
		gameData.value.currentScore = 0
		gameData.value.gameOver = false
		gameData.value.started = false
		gameData.value.players.forEach((p) => {
			p.score = 0
			p.out = false
		})
	}

	const quitGame = () => {
		resetStorage()
	}

	const exitGame = () => {
		resetStorage()
		router.push('/')
	}

	const resetStorage = () => {
		localStorage.removeItem('gameData')
		gameData.value = createDefaultGameData()
		hideTransition()
	}

	const endRound = () => {
		closeDrawer()

		if (gameData.value.currentRound >= gameData.value.totalRounds) {
			endGame()
		} else {
			gameData.value.currentScore = 0
			gameData.value.currentRound++
			gameData.value.currentRoundRolls = []
			gameData.value.players.forEach((player) => {
				player.out = false
			})

			setTimeout(animateNextRound, 200)
		}
	}

	const markOut = (id: number) => {
		const playerToGoOut = gameData.value.players.find((p) => p.id === id)
		if (!playerToGoOut) return

		createEvent('markOut', id)

		const wasCurrentPlayer = playerToGoOut.id === gameData.value.currentPlayerId

		playerToGoOut.score += gameData.value.currentScore
		playerToGoOut.out = true

		if (playersStillIn.value.length === 0) {
			endRound()
		}

		if (wasCurrentPlayer) {
			nextPlayer()
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

	const handleNumberButton = (value: number | string) => {
		createEvent('manualRoll', gameData.value.currentPlayerId, value)
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

		if (gameData.value.currentRoundRolls.length <= 3) {
			if (newRollValue !== 7 && typeof newRollValue === 'number') {
				gameData.value.currentScore = gameData.value.currentScore + newRollValue
			} else {
				gameData.value.currentScore = gameData.value.currentScore + 70
			}
		} else {
			if (newRollValue === 7) {
				endRound()
				animateBadSeven()
			} else if (newRollValue === 'doubles') {
				//double score - rolled doubles
				gameData.value.currentScore = gameData.value.currentScore * 2
			} else if (typeof newRollValue === 'number') {
				//normal addition
				gameData.value.currentScore = gameData.value.currentScore + newRollValue
			}
		}

		nextPlayer()
	}

	const endGame = () => {
		gameData.value.gameOver = true
		showTransition()
		setTimeout(() => {
			hideTransition()
		}, 1200)
	}

	const createEvent = (
		type: 'manualRoll' | 'markOut',
		playerId: number | null,
		rollValue?: number | string | null,
	) => {
		// const gameDataSnapshot = structuredClone(toRaw(gameData.value))

		const gameDataSnapshot: GameData = {
			setupStep: gameData.value.setupStep,
			players: gameData.value.players.map((player) => ({ ...player })),
			totalRounds: gameData.value.totalRounds,
			started: gameData.value.started,
			gameOver: gameData.value.gameOver,
			currentRound: gameData.value.currentRound,
			currentScore: gameData.value.currentScore,
			currentPlayerId: gameData.value.currentPlayerId,
			currentRoundRolls: gameData.value.currentRoundRolls.map((roll) => ({
				...roll,
			})),
		}

		const event: Event = {
			id: generateId(),
			type,
			playerId,
			round: gameData.value.currentRound,
			rollValue: rollValue ?? null,
			gameData: gameDataSnapshot,
		}

		if (gameData.value.eventHistory !== undefined) {
			gameData.value.eventHistory.push(event)
		}
	}

	const undoEvent = (id: number) => {
		const eventToUndo = gameData.value.eventHistory?.find((e) => e.id === id)

		const eventIndex = gameData.value.eventHistory?.findIndex(
			(e: Event) => e.id === id,
		)
		if (eventToUndo && eventIndex !== undefined && eventIndex !== -1) {
			gameData.value = {
				...eventToUndo.gameData,
				eventHistory: gameData.value.eventHistory || [],
			}
			gameData.value.eventHistory?.splice(eventIndex, 1)
		}

		if (gameData.value.eventHistory?.length === 0) {
			closeDrawer()
		}
	}

	const onDragEnd = () => {
		unfocusInput()
		// focusInput()
		gameData.value.players = gameData.value.players.map((p) => ({
			id: p.id,
			name: p.name,
			score: p.score,
			out: p.out,
		}))
		dragging.value = false
	}

	watch(
		gameData,
		() => {
			updateStorage(localStorage, 'gameData', JSON.stringify(gameData.value))
		},
		{ deep: true },
	)

	watch(
		() => gameData.value.setupStep,
		(newStep) => {
			if (newStep === 1) {
				nextTick(() => {
					focusInput()
				})
			}
		},
	)

	onMounted(() => {
		const savedGameData = localStorage.getItem('gameData')
		if (savedGameData) {
			gameData.value = JSON.parse(savedGameData)
		}
	})

	return {
		gameData,
		playersStillIn,
		playerRankings,
		playersSortedByStatus,
		eventHistoryReversed,
		showTransition,
		hideTransition,
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
		resetStorage,
		markOut,
		handleNumberButton,
		undoEvent,
		onDragEnd,
	}
}
