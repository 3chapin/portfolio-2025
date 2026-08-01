import type { GameData } from '@/types/gameData.ts'

export type Event = {
	id: number
	type: 'manualRoll' | 'markOut'
	playerId: number | null
	round: number
	rollValue?: number | string | null
	gameData: GameData
}
