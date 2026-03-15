import { computed, ref, onMounted, onUnmounted } from 'vue'

interface NavigatorUserAgentData {
	platform: string
	mobile?: boolean
	brands?: Array<{ brand: string; version: string }>
}

export const platform = computed(() => {
	if (hasUserAgentData(navigator)) {
		return navigator?.userAgentData?.platform
	} else {
		return navigator.userAgent
	}
})

export const isMac = computed(() => {
	if (hasUserAgentData(navigator)) {
		return navigator?.userAgentData?.platform === 'macOS'
	} else {
		return false
	}
})

export const isMobile = computed(() => {
	if (hasUserAgentData(navigator)) {
		return !!navigator.userAgentData.mobile
	} else {
		// Fallback: check userAgent string for common mobile indicators
		return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
			navigator.userAgent,
		)
	}
})

function hasUserAgentData(
	nav: Navigator,
): nav is Navigator & { userAgentData: NavigatorUserAgentData } {
	return 'userAgentData' in nav
}

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
