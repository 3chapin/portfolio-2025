interface NavigatorUserAgentData {
	platform: string
	mobile?: boolean
	brands?: Array<{ brand: string; version: string }>
}

function hasUserAgentData(
	nav: Navigator,
): nav is Navigator & { userAgentData: NavigatorUserAgentData } {
	return 'userAgentData' in nav
}

export const getPlatform = () => {
	if (hasUserAgentData(navigator)) {
		return navigator?.userAgentData?.platform
	} else {
		return navigator.userAgent
	}
}

export const isMac = () => {
	if (hasUserAgentData(navigator)) {
		return navigator?.userAgentData?.platform === 'macOS'
	} else {
		return false
	}
}

export const isMobile = () => {
	if (hasUserAgentData(navigator)) {
		return !!navigator.userAgentData.mobile
	} else {
		// Fallback: check userAgent string for common mobile indicators
		return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
			navigator.userAgent,
		)
	}
}
