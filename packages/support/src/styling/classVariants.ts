import { upperCaseFirst } from '../strings'
import { CssModule } from '../types'
import { classNames } from './classNames'

type CvaResolver<T> = (
  variants?: T extends VariantSchema ? Partial<T> : never,
  ...extraClasses: Parameters<typeof classNames>
) => string
type VariantSchema = Record<string, unknown> & { [key: string]: unknown }

const createClassName = (baseclass: string, ...propClasses: string[]): string => {
  const suffix = propClasses.length > 0 ? '__' + propClasses.join('_') : ''

  return `${baseclass}${suffix}`
}

const createPropClassName = (propName: string, propValue: unknown): string => {
  const strValue = upperCaseFirst(String(propValue))

  if (strValue === 'True') {
    return propName
  }

  return `${propName}${strValue}`
}

const resolveBaseClass = (baseClass: string, stylesMap: Map<string, string>): string => {
  const baseClassKey = [...stylesMap].find(([, value]) => baseClass === value)?.at(0)

  const resolvedBaseClass = stylesMap.has(baseClass as string)
    ? (baseClass as string)
    : baseClassKey
    ? baseClassKey
    : undefined

  if (!resolvedBaseClass) {
    throw new Error(`Base class "${baseClass as string}" does not exist in CSS module file.`)
  }

  return resolvedBaseClass
}

export function classVariants<T extends VariantSchema>(
  cssModule: CssModule,
  baseClass: keyof typeof cssModule,
  combinedVariants?: Array<[keyof T, keyof T]>
): CvaResolver<T> & {
  [K: keyof typeof cssModule]: string
} {
  const stylesMap = new Map(Object.entries(cssModule))
  const resolvedBaseClass = resolveBaseClass(baseClass as string, stylesMap)

  function classResolver(
    variants?: VariantSchema,
    ...extraClasses: Parameters<typeof classNames>
  ): string {
    const classes: string[] = [createClassName(cssModule[resolvedBaseClass])]
    if (!variants) {
      return classes.join(' ')
    }

    const variantsDefined = Object.fromEntries(
      Object.entries(variants).filter(([, v]) => v !== undefined)
    )

    const sortedVariantKeys = Object.keys(variantsDefined).sort()

    for (const propName of sortedVariantKeys) {
      const propValue = String(variantsDefined[propName])
      const propClassName = createClassName(
        resolvedBaseClass,
        createPropClassName(propName, propValue)
      )
      if (!stylesMap.has(propClassName)) {
        console.warn(`Variant class "${propClassName}" is not yet defined in the CSS module.`)
        continue
      }

      classes.push(cssModule[propClassName])
    }

    const combinations = (combinedVariants || []) as unknown as [string, string][]

    for (const combination of combinations) {
      if (new Set(combination).size !== 2) {
        throw new Error('Passed combinedVariants does not have exactly 2 different prop names')
      }
      if (
        sortedVariantKeys.includes(combination[0]) &&
        sortedVariantKeys.includes(combination[1])
      ) {
        const propNameA = combination[0]
        const propNameB = combination[1]
        const propValueA = String(variantsDefined[propNameA])
        const propValueB = String(variantsDefined[propNameB])
        const combiPropClassName = createClassName(
          resolvedBaseClass,
          createPropClassName(propNameA, propValueA),
          createPropClassName(propNameB, propValueB)
        )

        if (!stylesMap.has(combiPropClassName)) {
          console.warn(
            `Combined variant class "${combiPropClassName}" is not yet defined in the CSS module.`
          )
          continue
        }

        classes.push(cssModule[combiPropClassName])
      }
    }

    const extraClassesStr = classNames(...extraClasses)

    return classes
      .concat(extraClassesStr ? [extraClassesStr] : [])
      .filter(cl => cl)
      .join(' ')
  }

  const typedFn = classResolver as any
  typedFn.toString = () => resolvedBaseClass

  Array.from(stylesMap.keys()).forEach(stylesKey => {
    if (stylesKey in typedFn) {
      return
    }
    typedFn[stylesKey] = cssModule[stylesKey]
  })

  return typedFn
}
