export function cleanHashBang(path: string): string {
  const parts = path.split('#', 2)
  if (parts.length === 1) {
    return parts[0]
  }
  if (parts.length === 0) {
    return ''
  }

  const hash = parts[1]

  return hash
    .replace(/(^#|^\/#)/, '')
    .replace(/(^\/+|\/+$)/, '')
    .replace(/\/+/g, '/')
    .replace(/\/+$/g, '')
}

export function parseHashbangPath(path?: string): [string, URLSearchParams] {
  if (!path) {
    return ['', new URLSearchParams()]
  }

  let cleanPath = cleanHashBang(path)

  if (!cleanPath.match(/^(\/?#)|([a-z]+\:)/)) {
    cleanPath = '/#/' + cleanPath
  }

  if (cleanPath.startsWith('#') && !cleanPath.startsWith('#/')) {
    cleanPath = '#/' + cleanPath
  }

  const url = new URL(cleanPath, window.location.origin)
  const queryFromHash = url.hash.split('?')
  if (queryFromHash.length > 1) {
    url.search = queryFromHash[1]
    url.hash = queryFromHash[0]
  }

  if (!url.hash) {
    return ['', url.searchParams]
  }

  return [cleanHashBang(url.hash).replace(/(^\/+|\/+$)/, ''), url.searchParams]
}

export function parseWindowHash(): [string, URLSearchParams] {
  return parseHashbangPath(window.location.hash)
}

export function asCleanHash(path: string): string {
  const [pathPart, query] = parseHashbangPath(path)
  const queryStr = query.size > 0 ? '?' + query.toString() : ''

  return `${pathPart}${queryStr}`
}

export function asRelativeHash(path: string): string {
  return `#/${asCleanHash(path)}`
}

export function asAbsoluteHash(path: string): string {
  return `/${asRelativeHash(path)}`
}

export function getWindowHash(): string {
  const actual = window?.location?.hash

  return actual || '/#/'
}

export function parsePathParams(pattern: string, path: string): URLSearchParams {
  // ('parsePathParams', pattern, path)
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')

  const params: URLSearchParams = new URLSearchParams()

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
      const paramName = patternPart.slice(1, -1)
      params.set(paramName, pathPart)
    }
  }

  return params
}

export function createPatternRegex(pattern: string): RegExp {
  if (pattern === '/' || pattern === '') {
    return new RegExp('^/?$')
  }
  const patternRegex = pattern
    .replace(/\//g, '\\/') // escape slashes
    .replace(/\*\*/g, '.*') // replace ** with .*
    .replace(/\/\*/g, '/[^/]+') // replace * with ([^/]+)
    .replace(/\[\.\.([^/}]+)\]/g, '(.+)') // replace [..param] with (.+)
    .replace(/\[([^/}]+)\]/g, '([^/]+)') // replace [param] with ([^/]+)

  return new RegExp(`^${patternRegex}$`)
}

export function withInitialSlash(path: string): string {
  return path.startsWith('/') ? path : '/' + path
}
