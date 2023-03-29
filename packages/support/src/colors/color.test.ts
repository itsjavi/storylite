import { Color, color, RgbaColor } from './color'

describe('Color class', () => {
  it('should create a Color object from a hex string', () => {
    const c = new Color('#f0f')
    expect(c.rgba).toEqual(new RgbaColor(255, 0, 255, 1))
  })

  it('should create a Color object from a shorthand hex string', () => {
    const c = new Color('#abcdef')
    expect(c.rgba).toEqual(new RgbaColor(171, 205, 239, 1))
  })

  it('should create a Color object from an RGBA string', () => {
    const c = new Color('rgba(100, 200, 50, 0.5)')
    expect(c.rgba).toEqual(new RgbaColor(100, 200, 50, 0.5))
  })

  it('should create a Color object from an RgbaColor object', () => {
    const c = new Color(new RgbaColor(255, 255, 255, 0.8))
    expect(c.rgba).toEqual(new RgbaColor(255, 255, 255, 0.8))
  })

  it('should create a Color object from a plain object', () => {
    const c = new Color({ r: 255, g: 255, b: 255, a: 0.8 })
    expect(c.rgba).toEqual(new RgbaColor(255, 255, 255, 0.8))
  })

  it('should create a Color object from a plain object without alpha', () => {
    const c = new Color({ r: 255, g: 255, b: 255 })
    expect(c.rgba).toEqual(new RgbaColor(255, 255, 255, 1))
  })

  it('should lighten a color by a given factor', () => {
    const c = new Color('rgb(56, 122, 178)')
    expect(c.rgba).toEqual(new RgbaColor(56, 122, 178, 1))

    const lightened = c.lighten(0.2)
    expect(lightened.rgba).toEqual(new RgbaColor(96, 149, 193, 1))
  })

  it('should darken a color by a given factor', () => {
    const c = new Color('rgb(50, 100, 150)')
    expect(c.rgba).toEqual(new RgbaColor(50, 100, 150, 1))

    const darkened = c.darken(0.2)
    expect(darkened.rgba).toEqual(new RgbaColor(40, 80, 120, 1))
  })

  it('should change the alpha of a color', () => {
    const c = new Color('rgba(50, 100, 150, 0.5)')
    const withAlpha = c.alpha(0.8)
    expect(withAlpha.rgba).toEqual(new RgbaColor(50, 100, 150, 0.8))
  })

  it('should return the complementary color', () => {
    const c = new Color('rgb(50, 100, 150)')
    const complementary = c.complementary()
    expect(complementary.rgba).toEqual(new RgbaColor(205, 155, 105, 1))
  })

  it('should convert a color to a hex string', () => {
    const c = new Color('rgba(255, 0, 255, 0.5)')
    expect(c.toHex()).toBe('#ff00ff')
  })

  it('should convert a color to a hex string with alpha', () => {
    const c = new Color('rgba(255, 0, 255, 0.5)')
    expect(c.toHexa()).toBe('#ff00ff80')
  })

  it('should convert a color to a transparent hex string', () => {
    const c = new Color('rgba(255, 0, 255, 0)')
    expect(c.toHexa()).toBe('#ff00ff00')
  })

  it('should convert a color to an RGBA string', () => {
    const c = new Color('rgb(50, 100, 150)')
    expect(c.toRgba()).toBe('rgba(50, 100, 150, 1)')
  })

  it('should convert a color to a string', () => {
    const c = new Color('rgb(50, 100, 150)')
    expect(c.toString()).toBe('rgba(50, 100, 150, 1)')
  })
})

it('color function should return a Color instance', () => {
  const c = color('rgb(50, 100, 150)')
  expect(c).toBeInstanceOf(Color)
})
