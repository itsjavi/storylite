import { useCallback, useEffect, useState } from 'react'

type UseBrowserStorageResult<T> = {
  value: T | null
  setValue: (value: T) => void
  resetValue: () => void
}

export function useBrowserStorage<T>(
  key: string,
  initialValue: T,
  driver: Storage = localStorage,
): UseBrowserStorageResult<T> {
  const initialize = (key: string) => {
    const item = driver.getItem(key)
    if (item && item !== 'undefined') {
      return JSON.parse(item)
    }

    driver.setItem(key, JSON.stringify(initialValue))

    return initialValue
  }

  // workaround for SSR:
  const [state, setState] = useState<T | null>(null)

  useEffect(() => {
    if (state === null) {
      setState(initialize(key))
    }
  }, [])

  const setValue = useCallback(
    (value: T) => {
      setState((state: T | null): T => {
        const resolvedValue = value instanceof Function ? value(state) : value
        driver.setItem(key, JSON.stringify(resolvedValue))

        return resolvedValue
      })
    },
    [key, setState],
  )

  const resetValue = useCallback(() => {
    driver.removeItem(key)
    setValue(initialValue)
  }, [key])

  return {
    value: state,
    setValue,
    resetValue,
  }
}
