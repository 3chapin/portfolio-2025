// import { onMounted, onUnmounted, shallowRef } from 'vue'

// export function useReactiveStorage(storageType: Storage, keyName: string) {
// 	const storageValue = shallowRef(safeJsonParse(storageType.getItem(keyName)))
// 	let removeEventListener: (() => void) | null = null

// 	onMounted(() => {
// 		removeEventListener = pollStorageChanges(
// 			storageType,
// 			keyName,
// 			(newValue) => (storageValue.value = newValue),
// 		)
// 	})

// 	onUnmounted(() => {
// 		removeEventListener?.()
// 	})

// 	return storageValue
// }

// export function pollStorageChanges(
// 	storageType: Storage,
// 	keyName: string,
// 	callback,
// ) {
// 	function storageEventListener(event: StorageEvent) {
// 		if (event.storageArea === storageType && event.key === keyName) {
// 			return callback(safeJsonParse(event.newValue))
// 		}
// 		return
// 	}
// 	window.addEventListener('storage', storageEventListener)
// 	return () => window.removeEventListener('storage', storageEventListener)
// }

export function updateStorage(
	storageType: Storage,
	key: string,
	newValue: string,
) {
	const oldValue = storageType.getItem(key)
	storageType.setItem(key, newValue)

	const event = new StorageEvent('storage', {
		key,
		oldValue,
		newValue,
		storageArea: storageType,
		url: window.location.href,
	})
	window.dispatchEvent(event)
}

// function safeJsonParse(value: string | null) {
// 	try {
// 		return value ? JSON.parse(value) : null
// 	} catch (error) {
// 		console.error('Error parsing JSON from storage:', error)
// 		return value
// 	}
// }
