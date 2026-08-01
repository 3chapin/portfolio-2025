import { createDefaultGameData } from '@/utils/createDefaultGameData.ts'

describe('createDefaultGameData', () => {
	it('should create default game data with correct structure and values', () => {
		expect(createDefaultGameData()).toEqual({
			setupStep: 0,
			players: [],
			totalRounds: 20,
			started: false,
			gameOver: false,
			currentRound: 1,
			currentScore: 0,
			currentPlayerId: null,
			currentRoundRolls: [],
			eventHistory: [],
		})
	})
})
