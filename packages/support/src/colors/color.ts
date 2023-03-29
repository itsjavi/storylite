type RgbColorSignature = { r: number; g: number; b: number; a?: number }

export class RgbaColor {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public readonly a: number
  ) {}

  static fromObject(color: RgbColorSignature): RgbaColor {
    return new RgbaColor(
      Math.max(Math.min(color.r, 255), 0),
      Math.max(Math.min(color.g, 255), 0),
      Math.max(Math.min(color.b, 255), 0),
      Math.max(Math.min(color.a === undefined ? 1 : color.a, 1), 0)
    )
  }
}

export class Color {
  public readonly rgba: RgbaColor

  constructor(color: string | RgbaColor | RgbColorSignature) {
    const rgba = {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    }

    if (typeof color !== 'string') {
      const safeColor = RgbaColor.fromObject(color)
      rgba.r = safeColor.r
      rgba.g = safeColor.g
      rgba.b = safeColor.b
      rgba.a = safeColor.a
    } else if (color.charAt(0) === '#') {
      // hex code
      const hex = color.substring(1)
      if (hex.length === 3) {
        // shorthand hex code
        rgba.r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
        rgba.g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
        rgba.b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
      } else {
        // full hex code
        rgba.r = parseInt(hex.substring(0, 2), 16)
        rgba.g = parseInt(hex.substring(2, 4), 16)
        rgba.b = parseInt(hex.substring(4, 6), 16)
      }
      rgba.a = 1
    } else {
      // assume it's an rgba() string
      const parts = color.substring(color.indexOf('(') + 1, color.indexOf(')')).split(',')
      rgba.r = parseInt(parts[0].trim())
      rgba.g = parseInt(parts[1].trim())
      rgba.b = parseInt(parts[2].trim())
      rgba.a = color.includes('rgba') ? parseFloat(parts[3].trim()) : 1
    }

    this.rgba = new RgbaColor(rgba.r, rgba.g, rgba.b, rgba.a)
  }

  public lighten(factor: number): Color {
    // Make sure lightenFactor is in range [0, 1]
    factor = Math.min(1, Math.max(0, factor))

    const a = this.rgba.a
    const r = Math.round(this.rgba.r + (255 - this.rgba.r) * factor)
    const g = Math.round(this.rgba.g + (255 - this.rgba.g) * factor)
    const b = Math.round(this.rgba.b + (255 - this.rgba.b) * factor)

    return new Color(new RgbaColor(r, g, b, a))
  }

  public darken(factor: number): Color {
    // Make sure lightenFactor is in range [0, 1]
    factor = Math.min(1, Math.max(0, factor))

    const a = this.rgba.a
    const r = Math.round(Math.max(this.rgba.r - this.rgba.r * factor, 0))
    const g = Math.round(Math.max(this.rgba.g - this.rgba.g * factor, 0))
    const b = Math.round(Math.max(this.rgba.b - this.rgba.b * factor, 0))

    return new Color(new RgbaColor(r, g, b, a))
  }

  public alpha(factor: number): Color {
    return new Color(
      new RgbaColor(this.rgba.r, this.rgba.g, this.rgba.b, Math.max(Math.min(factor, 1), 0))
    )
  }

  public complementary(): Color {
    return new Color(
      new RgbaColor(
        Math.abs(255 - this.rgba.r),
        Math.abs(255 - this.rgba.g),
        Math.abs(255 - this.rgba.b),
        this.rgba.a
      )
    )
  }

  public toHex(): string {
    const rHex = this.rgba.r.toString(16).padStart(2, '0')
    const gHex = this.rgba.g.toString(16).padStart(2, '0')
    const bHex = this.rgba.b.toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }

  public toHexa(): string {
    const rHex = this.rgba.r.toString(16).padStart(2, '0')
    const gHex = this.rgba.g.toString(16).padStart(2, '0')
    const bHex = this.rgba.b.toString(16).padStart(2, '0')
    const aHex =
      this.rgba.a > 0
        ? Math.round(+this.rgba.a * 255)
            .toString(16)
            .padStart(2, '0')
        : '00'

    return `#${rHex}${gHex}${bHex}${aHex}`
  }

  public toRgba(): string {
    return `rgba(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b}, ${this.rgba.a})`
  }

  public toString(): string {
    return this.toRgba()
  }
}

export function color(value: string | RgbaColor): Color {
  return new Color(value)
}
