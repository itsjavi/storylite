import { vi } from 'vitest'
import { classVariants } from './classVariants'

describe('classVariants', () => {
  const styles = {
    baseClass: 'baseClass__abc',
    baseClass__sizeSmall: 'baseClass__sizeSmall__def',
    baseClass__colorRed: 'baseClass__colorRed__ghi',
    baseClass__sizeSmall_colorRed: 'baseClass__sizeSmall_colorRed__jkl',
  }

  it('returns a function', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(typeof cva).toBe('function')
  })

  it('returns base class name when no variants are provided', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(cva()).toBe('baseClass__abc')
  })

  it('returns base class name with variant class when a variant is provided', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(cva({ size: 'small' })).toBe('baseClass__abc baseClass__sizeSmall__def')
  })

  it('returns base class name with multiple variant classes when multiple variants are provided', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(cva({ size: 'small', color: 'red' })).toBe(
      'baseClass__abc baseClass__colorRed__ghi baseClass__sizeSmall__def'
    )
  })

  it('returns base class name with combined variant classes when combined variants are provided', () => {
    const cva = classVariants(styles, 'baseClass', [['size', 'color']])
    expect(cva({ size: 'small', color: 'red' })).toBe(
      'baseClass__abc baseClass__colorRed__ghi baseClass__sizeSmall__def baseClass__sizeSmall_colorRed__jkl'
    )
  })

  it('returned function also contains the class map', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(cva.baseClass__colorRed).toBe('baseClass__colorRed__ghi')
    expect(cva.baseClass__sizeSmall).toBe('baseClass__sizeSmall__def')
  })

  it('returned function can concat extra class names with conditions', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(cva({ size: 'small' }, 'xyz', [false, 'cba'])).toBe(
      'baseClass__abc baseClass__sizeSmall__def xyz'
    )
  })

  it('ignores undefined variant values', () => {
    const cva = classVariants(styles, 'baseClass')
    expect(cva({ size: undefined }, 'xyz', [false, 'cba'])).toBe('baseClass__abc xyz')
  })

  it('does not replace resolver function own properties', () => {
    const cva = classVariants({ apply: 'replaced_apply', myApply: 'myApply_123' }, 'apply')
    expect(cva.apply).not.toBe('replaced_apply')
    expect(cva.myApply).toBe('myApply_123')
  })

  it('allows passing the values of the CSS module as baseClass', () => {
    const cva = classVariants({ foo: 'my_foo' }, 'my_foo')
    expect(cva()).toBe('my_foo')
  })

  it('boolean values do not take part of class name when they are true', () => {
    const cva = classVariants({ foo: 'foo_s92', foo__active: 'foo__active_yi3' }, 'foo_s92')
    expect(cva({ active: true })).toBe('foo_s92 foo__active_yi3')
  })

  it('throws an error when the base class does not exist in the styles', () => {
    expect(() => {
      classVariants(styles as any, 'invalidBaseClass')
    }).toThrow('Base class "invalidBaseClass" does not exist in CSS module file.')
  })

  it('throws an error when combinedVariants is not an array of exactly two different prop names', () => {
    const cva = classVariants(styles, 'baseClass', [['size', 'size']])
    expect(() => {
      cva({ size: 'small', color: 'red' })
    }).toThrow('Passed combinedVariants does not have exactly 2 different prop names')

    expect(() => {
      classVariants(styles, 'baseClass', [])()
    }).not.toThrow()

    expect(() => {
      classVariants(styles, 'baseClass', [
        ['size', 'color'],
        ['color', 'size'],
      ])()
    }).not.toThrow()

    expect(() => {
      classVariants(styles, 'baseClass', [['size', 'size']])({ size: 'small' })
    }).toThrow('Passed combinedVariants does not have exactly 2 different prop names')
  })

  it('logs a warning when a variant class does not exist in the styles', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      /*-*/
    })
    const cva = classVariants(styles, 'baseClass')
    cva({ invalidProp: 'value' })
    expect(spy).toHaveBeenCalledWith(
      'Variant class "baseClass__invalidPropValue" is not yet defined in the CSS module.'
    )
    spy.mockRestore()
  })

  it('logs a warning when a combined variant class does not exist in the styles', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      /*-*/
    })
    const cva = classVariants(styles, 'baseClass', [['size', 'color']])
    cva({ size: 'small', color: 'invalidColor' })
    expect(spy).toHaveBeenCalledWith(
      'Combined variant class "baseClass__sizeSmall_colorInvalidColor" is not yet defined in the CSS module.'
    )
    spy.mockRestore()
  })
})
