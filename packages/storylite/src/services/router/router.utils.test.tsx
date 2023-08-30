import {
  asAbsoluteHash,
  asRelativeHash,
  cleanHashBang,
  createPatternRegex,
  getStoryUrl,
  getWindowHash,
  parseHashbangPath,
  parsePathParams,
  parseWindowHash,
} from './router.utils'

describe('Routing Utils', () => {
  let windowSpy: jest.SpyInstance | undefined

  beforeEach(() => {
    windowSpy = jest.spyOn(globalThis, 'window', 'get')
    windowSpy.mockImplementation(() => ({
      location: {
        hash: 'https://example.com/#/my-path?foo=bar&bar=baz',
        origin: 'http://localhost',
      },
    }))
  })

  afterEach(() => {
    windowSpy?.mockRestore()
  })

  describe('cleanHashBang', () => {
    it('should remove hashbang characters at the beginning', () => {
      const cleaned = cleanHashBang('/#/path')
      expect(cleaned).toBe('path')
    })

    it('should remove hashbang characters at the beginning and slashes at the end', () => {
      const cleaned = cleanHashBang('#/path///')
      expect(cleaned).toBe('path')
    })

    it('should remove hashbang characters at the beginning and multiple slashes at the end', () => {
      const cleaned = cleanHashBang('/#path/////')
      expect(cleaned).toBe('path')
    })

    it('should not remove hashbang characters within the path', () => {
      const cleaned = cleanHashBang('/#/pa/th')
      expect(cleaned).toBe('pa/th')
    })

    it('should not remove hashbang characters within the path and remove slashes at the end', () => {
      const cleaned = cleanHashBang('/#/pa/th/////')
      expect(cleaned).toBe('pa/th')
    })
  })

  describe('parseHashbangPath', () => {
    it('should parse hashbang path and query params', () => {
      const [path, query] = parseHashbangPath('/#/route?key=value')
      expect(path).toBe('route')
      expect(query.get('key')).toBe('value')
    })

    it('should parse hashbang path with no query params', () => {
      const [path, query] = parseHashbangPath('/#/route')
      expect(path).toBe('route')
      expect(query.toString()).toBe('')
    })

    it('should parse hashbang path with multiple query params', () => {
      const [path, query] = parseHashbangPath('/#/route?key1=value1&key2=value2')
      expect(path).toBe('route')
      expect(query.get('key1')).toBe('value1')
      expect(query.get('key2')).toBe('value2')
    })

    it('should handle empty string', () => {
      const [path, query] = parseHashbangPath('')
      expect(path).toBe('')
      expect(query.toString()).toBe('')
    })

    it('should handle undefined input', () => {
      const [path, query] = parseHashbangPath(undefined)
      expect(path).toBe('')
      expect(query.toString()).toBe('')
    })
  })

  describe('parseWindowHash', () => {
    it('should parse window location hash', () => {
      const [path, query] = parseWindowHash()
      expect(path).toBe('my-path')
      expect(query.get('foo')).toBe('bar')
      expect(query.get('bar')).toBe('baz')
    })
  })

  describe('asRelativeHash', () => {
    it('should convert path to relative hash format', () => {
      const relativeHash = asRelativeHash('/route')
      expect(relativeHash).toBe('#/route')
    })

    it('should clean path and convert it to relative hash format', () => {
      const relativeHash = asRelativeHash('/#/route///')
      expect(relativeHash).toBe('#/route')
    })
  })

  describe('asAbsoluteHash', () => {
    it('should convert path to absolute hash format', () => {
      const absoluteHash = asAbsoluteHash('/route')
      expect(absoluteHash).toBe('/#/route')
    })

    it('should clean path and convert it to absolute hash format', () => {
      const absoluteHash = asAbsoluteHash('#/route///')
      expect(absoluteHash).toBe('/#/route')
    })
  })

  describe('getWindowHash', () => {
    it('should get window location hash', () => {
      const hash = getWindowHash()
      expect(hash).toEqual('https://example.com/#/my-path?foo=bar&bar=baz')
    })
  })

  describe('parsePathParams', () => {
    it('should parse path parameters', () => {
      const pattern = '/user/[id]/posts/[postId]'
      const path = '/user/123/posts/456'
      const params = parsePathParams(pattern, path)

      expect(params.get('id')).toBe('123')
      expect(params.get('postId')).toBe('456')
    })

    it('should handle pattern with no parameters', () => {
      const pattern = '/users'
      const path = '/users'
      const params = parsePathParams(pattern, path)

      expect(params.toString()).toBe('')
    })

    it('should handle path with extra segments', () => {
      const pattern = '/user/[id]'
      const path = '/user/123/profile'
      const params = parsePathParams(pattern, path)

      expect(params.get('id')).toBe('123')
    })

    it('should handle empty pattern and path', () => {
      const pattern = ''
      const path = ''
      const params = parsePathParams(pattern, path)

      expect(params.toString()).toBe('')
    })
  })

  describe('createPatternRegex', () => {
    it('should create a regex for / pattern', () => {
      const pattern = '/'
      const regex = createPatternRegex(pattern)
      expect(regex.test('/')).toBe(true)
      expect(regex.test('/path')).toBe(false)
    })

    it('should create a regex for empty pattern', () => {
      const pattern = ''
      const regex = createPatternRegex(pattern)
      expect(regex.test('')).toBe(true)
      expect(regex.test('/path')).toBe(false)
    })

    it('should create a regex for * pattern', () => {
      const pattern = '/path/*'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/path\\/[^/]+$/')
      expect(regex.test('/path/something')).toBe(true)
      expect(regex.test('/path/something/else')).toBe(false)
      expect(regex.test('/other/something')).toBe(false)
    })

    it('should create a regex for a literal pattern', () => {
      const pattern = '/path'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/path$/')
      expect(regex.test('/path/something')).toBe(false)
      expect(regex.test('/path')).toBe(true)
      expect(regex.test('/path/')).toBe(false)
      expect(regex.test('path')).toBe(false)
      expect(regex.test('path')).toBe(false)
    })

    it('should create a regex for ** pattern', () => {
      const pattern = '/path/**'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/path\\/.*$/')
      expect(regex.test('/path/something')).toBe(true)
      expect(regex.test('/path/something/else')).toBe(true)
      expect(regex.test('/other/something')).toBe(false)
    })

    it('should create a regex for * pattern followed by another segment', () => {
      const pattern = '/path/*/to/somewhere'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/path\\/[^/]+\\/to\\/somewhere$/')
      expect(regex.test('/path/something')).toBe(false)
      expect(regex.test('/path/something/else')).toBe(false)
      expect(regex.test('/other/something')).toBe(false)
      expect(regex.test('/path/something/in/the/middle/to/somewhere')).toBe(false)
      expect(regex.test('/path/something/to/somewhere')).toBe(true)
    })

    it('should create a regex for ** pattern followed by another segment', () => {
      const pattern = '/path/**/to/somewhere'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/path\\/.*\\/to\\/somewhere$/')
      expect(regex.test('/path/something')).toBe(false)
      expect(regex.test('/path/something/else')).toBe(false)
      expect(regex.test('/other/something')).toBe(false)
      expect(regex.test('/path/something/in/the/middle/to/somewhere')).toBe(true)
    })

    it('should create a regex for [param] pattern', () => {
      const pattern = '/user/[id]/profile/[section]'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/user\\/([^/]+)\\/profile\\/([^/]+)$/')
      expect(regex.test('/user/123/profile/settings')).toBe(true)
      expect(regex.test('/user/456/profile')).toBe(false)
      expect(regex.test('/user/profile/about')).toBe(false)
    })
  })

  describe('getStoryUrl', () => {
    it('should generate a default URL for a story', () => {
      const url = getStoryUrl('my-story', 'exportName', { target: 'top' })
      expect(url).toBe('/#/stories/my-story/exportName')
    })

    it('should generate a default URL for the dashboard', () => {
      const url = getStoryUrl(undefined, undefined, { target: 'top' })
      expect(url).toBe('/#/dashboard')
    })

    it('should generate a standalone URL for a story', () => {
      const url = getStoryUrl('my-story', 'exportName', { target: 'top', standalone: true })
      expect(url).toBe('/#/stories/my-story/exportName/?standalone=true')
    })

    it('should generate an iframe URL for a story', () => {
      const url = getStoryUrl('my-story', 'exportName', { target: 'iframe' })
      expect(url).toBe('/#/preview/stories/my-story/exportName')
    })

    it('should generate an iframe URL for the dashboard', () => {
      const url = getStoryUrl(undefined, undefined, { target: 'iframe' })
      expect(url).toBe('/#/preview/dashboard')
    })

    it('should generate a hashbang URL', () => {
      const url = getStoryUrl('my-story', 'exportName', { target: 'top' })
      expect(url).toBe('/#/stories/my-story/exportName')
    })
  })
})
