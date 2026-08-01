import { ref, onMounted, onUnmounted } from 'vue'

export const useKeyboardOpen = () => {
	const keyboardOpen = ref(false)

	const handleViewportResize = () => {
		if (!window.visualViewport) return
		keyboardOpen.value =
			window.visualViewport.height / window.innerHeight < 0.75
	}

	onMounted(() => {
		window.visualViewport?.addEventListener('resize', handleViewportResize)
		window.visualViewport?.addEventListener('scroll', handleViewportResize)
	})

	onUnmounted(() => {
		window.visualViewport?.removeEventListener('resize', handleViewportResize)
		window.visualViewport?.removeEventListener('scroll', handleViewportResize)
	})

	return { keyboardOpen }
}
