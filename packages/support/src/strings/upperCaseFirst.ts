export function upperCaseFirst(str: string): string {
  if (str.length === 0) {
    return str
  }

  const firstChar = str.charAt(0).toUpperCase()
  if (str.length === 1) {
    return firstChar
  }

  return firstChar + str.substring(1)
}
