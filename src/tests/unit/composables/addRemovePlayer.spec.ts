import { useCyberDiceGame } from '@/composables/useCyberDiceGame'
import { ref } from 'vue'

describe('useCyberDiceGame', () => {
	// Mock functions for the composable
	const dragging = ref(false)
	const showTransition = () => {}
	const hideTransition = () => {}
	const closeDrawer = () => {}
	const animateNextRound = () => {}
	const animateBadSeven = () => {}
	const focusInput = () => {}
	const unfocusInput = () => {}

	const { gameData, addPlayer, removePlayer } = useCyberDiceGame(
		dragging,
		showTransition,
		hideTransition,
		closeDrawer,
		animateNextRound,
		animateBadSeven,
		focusInput,
		unfocusInput,
	)

	it('should add a player correctly', () => {
		expect(gameData.value.players.length).toBe(0)
		addPlayer('Test Player')
		expect(gameData.value.players.length).toBe(1)

		if (gameData.value.players[0] === undefined) return
		else {
			expect(gameData.value.players[0].name).toBe('Test Player')
			expect(gameData.value.players[0].score).toBe(0)
			expect(gameData.value.players[0].out).toBe(false)
		}
	})

	it('should remove a player correctly', () => {
		expect(gameData.value.players.length).toBe(1)
		const playerId = gameData.value.players[0]?.id
		if (playerId !== undefined) {
			removePlayer(playerId)
		}
		expect(gameData.value.players.length).toBe(0)
	})
})
