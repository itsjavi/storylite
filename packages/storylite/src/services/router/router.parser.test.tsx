import {
  cleanHashPath,
  createPatternRegex,
  getWindowHash,
  parsePathParams,
  parseUri,
} from './router.parser'

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
      const cleaned = cleanHashPath('/#/path')
      expect(cleaned).toBe('/path')
    })

    it('should remove hashbang characters at the beginning and slashes at the end', () => {
      const cleaned = cleanHashPath('#/path///')
      expect(cleaned).toBe('/path')
    })

    it('should remove hashbang characters at the beginning and multiple slashes at the end', () => {
      const cleaned = cleanHashPath('/#path/////')
      expect(cleaned).toBe('/path')
    })

    it('should not remove hashbang characters within the path', () => {
      const cleaned = cleanHashPath('/#/pa/th')
      expect(cleaned).toBe('/pa/th')
    })

    it('should not remove hashbang characters within the path and remove slashes at the end', () => {
      const cleaned = cleanHashPath('/#/pa/th/////')
      expect(cleaned).toBe('/pa/th')
    })
  })

  describe('parseUri', () => {
    it('should parse empty uri', () => {
      const parsed = parseUri('')
      expect(parsed.basePath).toBe('/')
      expect(parsed.hashPath).toBe('/')
      expect(parsed.query.size).toBe(0)
      expect(parsed.params.size).toBeFalsy()
    })

    it('should parse uri with base path, hashbang and query params', () => {
      const parsed = parseUri('/demos/#/route?key=value')
      expect(parsed.basePath).toBe('/demos/')
      expect(parsed.hashPath).toBe('/route')
      expect(parsed.params.get('key')).toBe('value')
      expect(parsed.query.get('key')).toBe('value')
    })

    it('should parse uri with base path, hashbang and query params before and after hashbang', () => {
      const parsed = parseUri('/demos/?key1=value1#/route?key2=value2')
      expect(parsed.basePath).toBe('/demos/')
      expect(parsed.hashPath).toBe('/route')
      expect(parsed.params.get('key1')).toBe('value1')
      expect(parsed.params.get('key2')).toBe('value2')
      expect(parsed.query.get('key1')).toBe('value1')
      expect(parsed.query.get('key2')).toBe('value2')
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

    it('should handle patterns with rest params', () => {
      const pattern = '/user/[...ids]'
      const path = '/user/123/456/789'
      const params = parsePathParams(pattern, path)

      expect(params.get('ids')).toBe('123/456/789')
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

    it('should create a regex for a rest pattern like [...params]', () => {
      const pattern = '/user/[id]/posts/[...postIds]'
      const regex = createPatternRegex(pattern)
      expect(String(regex)).toBe('/^\\/user\\/([^/]+)\\/posts\\/(.+)$/')
      expect(regex.test('/user/456/posts')).toBe(false)
      expect(regex.test('/user/456/posts/1')).toBe(true)
      expect(regex.test('/user/123/posts/1/2/3')).toBe(true)
    })
  })
})
