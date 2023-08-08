import { act, renderHook } from '@testing-library/react'

import { useBrowserStorage } from './useBrowserStorage'

describe('useBrowserStorage', () => {
  const localStorageBackup = window.localStorage
  let localStorageMock: { [key: string]: string } = {}
  const getParsedItem = (key: string) => JSON.parse(localStorageMock[key] || '')

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => (localStorageMock[key] = value),
        removeItem: (key: string) => delete localStorageMock[key],
      },
      writable: true,
    })
  })

  beforeEach(() => {
    localStorageMock = {}
  })

  afterAll(() => {
    localStorageMock = {}
    Object.defineProperty(window, 'localStorage', { value: localStorageBackup })
  })

  it('should initialize state from local storage', () => {
    localStorage.setItem('myKey', JSON.stringify({ foo: 'bar' }))

    const { result } = renderHook(() => useBrowserStorage('myKey', { baz: 'qux' }))
    expect(result.current.value).toEqual({ foo: 'bar' })
  })

  it('should set and get state from local storage', () => {
    const { result } = renderHook(() => useBrowserStorage<any>('myKey', { baz: 'quy' }))

    act(() => {
      result.current.setValue({ foo: 'bar' })
    })

    expect(result.current.value).toEqual({ foo: 'bar' })
    expect(getParsedItem('myKey')).toEqual({ foo: 'bar' })
  })

  it('should set state using a callback function', () => {
    const { result } = renderHook(() => useBrowserStorage<any>('myKey', { baz: 'qux' }))

    act(() => {
      result.current.setValue((value: any) => ({
        ...value,
        foo: 'bar',
      }))
    })

    expect(result.current.value).toEqual({
      baz: 'qux',
      foo: 'bar',
    })
    expect(getParsedItem('myKey')).toEqual({
      baz: 'qux',
      foo: 'bar',
    })
  })

  it('should reset state and remove from local storage', () => {
    localStorage.setItem('myKey', JSON.stringify({ foo: 'bar' }))

    const { result } = renderHook(() => useBrowserStorage<any>('myKey', { baz: 'qux' }))

    act(() => {
      result.current.setValue({ foo: 'bar' })
    })

    expect(result.current.value).toEqual({ foo: 'bar' })
    expect(getParsedItem('myKey')).toEqual({ foo: 'bar' })

    act(() => {
      result.current.resetValue()
    })

    expect(result.current.value).toEqual({ baz: 'qux' })
    expect(getParsedItem('myKey')).toEqual({ baz: 'qux' })
  })
})
