import { ref } from 'vue'

export function useFlashOverlay() {
	const flashing = ref(false)

	/**
	 * Trigger a red flash
	 * @param duration how long the flash lasts in ms
	 */
	const flashRed = (duration = 200) => {
		flashing.value = true
		setTimeout(() => {
			flashing.value = false
		}, duration)
	}

	return {
		flashing,
		flashRed,
	}
}
