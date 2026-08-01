import type { Player } from '@/types/player.ts'
import type { Event } from '@/types/event.ts'

export type GameData = {
	setupStep: number
	players: Player[]
	totalRounds: number
	started: boolean
	gameOver: boolean
	currentRound: number
	currentScore: number
	currentPlayerId: number | null
	currentRoundRolls: { playerId: number; rollValue: number | string }[]
	eventHistory?: Event[]
}
