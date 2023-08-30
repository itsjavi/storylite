export function getLocalStorageItem<T = any>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key)
  if (item && item !== 'undefined') {
    return JSON.parse(item)
  }

  return defaultValue
}

export function setLocalStorageItem<T = any>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}
