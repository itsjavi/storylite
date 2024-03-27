import type { ParsedUri } from './router.types'

export function parseUri(uri: string): ParsedUri {
  const parsedUri = new URL(uri ?? '', window.location.origin)
  const queryParams = parsedUri.searchParams
  const [hashPath, hashPathQuery] = cleanHashPath(parsedUri.hash).split('?')
  const extraQueryParams = new URLSearchParams(hashPathQuery)
  extraQueryParams.forEach((value, key) => {
    queryParams.set(key, value)
  })

  return {
    basePath: parsedUri.pathname,
    hashPath: cleanHashPath(hashPath),
    params: new URLSearchParams(queryParams),
    query: queryParams,
  }
}

export function cleanHashPath(hashPath: string): string {
  return (
    '/' +
    hashPath
      .trim()
      .replace(/^(\/?#\/?)/g, '')
      .replace(/\/$/g, '')
      .split('/')
      .filter(Boolean)
      .join('/')
  )
}

export function parsePathParams(pattern: string, path: string): URLSearchParams {
  // ('parsePathParams', pattern, path)
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')

  const params: URLSearchParams = new URLSearchParams()

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    if (patternPart.startsWith('[...') && patternPart.endsWith(']')) {
      // if is a rest param, add all remaining parts
      const paramName = patternPart.slice(4, -1)
      params.set(paramName, pathParts.slice(i).join('/'))
      break
    }

    if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
      const paramName = patternPart.slice(1, -1)

      params.set(paramName, pathPart)
    }
  }

  return params
}

export function createPatternRegex(pattern: string): RegExp {
  if (pattern === '/' || pattern === '') {
    return /^\/?$/
  }
  const patternRegex = pattern
    .replace(/\//g, '\\/') // escape slashes
    .replace(/\*\*/g, '.*') // replace ** with .*
    .replace(/\/\*/g, '/[^/]+') // replace * with ([^/]+)
    .replace(/\[\.\.\.([^/}]+)\]/g, '(.+)') // replace [...param] with (.+)
    .replace(/\[([^/}]+)\]/g, '([^/]+)') // replace [param] with ([^/]+)

  return new RegExp(`^${patternRegex}$`)
}

export function getWindowHash(): string {
  return window?.location?.hash ?? ''
}
