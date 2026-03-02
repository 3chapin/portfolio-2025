import { computed } from 'vue'

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
		return navigator?.userAgentData?.mobile
	} else {
		return undefined
	}
})

function hasUserAgentData(
	nav: Navigator,
): nav is Navigator & { userAgentData: NavigatorUserAgentData } {
	return 'userAgentData' in nav
}
