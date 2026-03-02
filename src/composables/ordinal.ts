import { computed } from 'vue'

export function useOrdinal(num: number | null | undefined) {
	if (!num || num === undefined) return
	const number = num

	const suffix = computed(() => {
		const n = number
		const j = n % 10
		const k = n % 100
		if (k === 11 || k === 12 || k === 13) return 'th'
		if (j === 1) return 'st'
		if (j === 2) return 'nd'
		if (j === 3) return 'rd'
		return 'th'
	})
	return suffix
}
