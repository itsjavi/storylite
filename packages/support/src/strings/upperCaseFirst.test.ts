import { upperCaseFirst } from './upperCaseFirst'

describe('upperCaseFirst', () => {
  test('capitalizes first character of string', () => {
    expect(upperCaseFirst('hello world')).toBe('Hello world')
  })

  test('handles empty string', () => {
    expect(upperCaseFirst('')).toBe('')
  })

  test('capitalizes single-character string', () => {
    expect(upperCaseFirst('a')).toBe('A')
  })

  test('handles string with only spaces', () => {
    expect(upperCaseFirst('   ')).toBe('   ')
  })
})
