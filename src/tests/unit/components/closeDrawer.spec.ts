import { afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import CyberDice from '@/components/cyberDiceGame/CyberDice.vue'

const startedGameData = {
	setupStep: 2,
	players: [{ id: 1, name: 'Test Player', score: 0, out: false }],
	totalRounds: 20,
	started: true,
	gameOver: false,
	currentRound: 1,
	currentScore: 0,
	currentPlayerId: 1,
	currentRoundRolls: [],
	eventHistory: [],
}

afterEach(() => {
	localStorage.removeItem('gameData')
})

describe('closeDrawer', () => {
	it('closes the drawer after it has been opened', async () => {
		localStorage.setItem('gameData', JSON.stringify(startedGameData))

		const wrapper = mount(CyberDice)
		await nextTick()

		const drawer = wrapper.find('#drawer')

		expect(drawer.exists()).toBe(true)
		expect(drawer.classes()).toContain('translate-y-full')

		await wrapper.find('button[name="enter-roll"]').trigger('click')

		expect(drawer.classes()).toContain('translate-y-0')
		expect(wrapper.find('#overlay').exists()).toBe(true)

		await wrapper.find('button[name="close-drawer-button"]').trigger('click')

		expect(drawer.classes()).toContain('translate-y-full')
		expect(wrapper.find('#overlay').exists()).toBe(false)
	})
})
