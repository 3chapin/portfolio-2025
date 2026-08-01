import { type GameData } from '@/types/gameData.ts'
import { type Player } from '@/types/player'

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

export const createDefaultGameData = (): GameData => ({
	setupStep: 0,
	players: [] as Player[],
	totalRounds: 20,
	started: false,
	gameOver: false,
	currentRound: 1,
	currentScore: 0,
	currentPlayerId: null,
	currentRoundRolls: [],
	eventHistory: [],
})
