import { onMounted, onUnmounted, shallowRef } from 'vue';

export function useReactiveStorage(storageType, keyName) {
  const storageValue = shallowRef(safeJsonParse(storageType.getItem(keyName)));
  let removeEventListener;

  onMounted(() => {
    removeEventListener = pollStorageChanges(storageType, keyName, (newValue) => (storageValue.value = newValue));
  });

  onUnmounted(() => {
    removeEventListener?.();
  });

  return storageValue;
}

export function pollStorageChanges(storageType, keyName, callback) {
  function storageEventListener(event) {
    if (event.storageArea === storageType && event.key === keyName) {
      return callback(safeJsonParse(event.newValue));
    }
    return;
  }
  window.addEventListener('storage', storageEventListener);
  return () => window.removeEventListener('storage', storageEventListener);
}

export function updateStorage(storageType, key, newValue) {
  const oldValue = storageType.getItem(key);
  storageType.setItem(key, newValue);

  const event = new StorageEvent('storage', {
    key,
    oldValue,
    newValue,
    storageArea: storageType,
    url: window.location.href,
  });
  window.dispatchEvent(event);
}

function safeJsonParse(value) {
    try {
        return value ? JSON.parse(value) : null;
    } catch (error) {
        return value;
    }
};