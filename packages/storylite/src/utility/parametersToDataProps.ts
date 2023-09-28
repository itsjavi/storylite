import type { SLParameters } from '@/types'

export function parametersToDataProps(parameters: SLParameters | undefined): {
  [key: `data-sl-${string}`]: any
} {
  const dataProps: { [key: string]: any } = {}

  if (parameters) {
    Object.keys(parameters)
      .filter((key) => {
        const val = parameters[key].value
        const valType = typeof val

        return (
          val !== undefined &&
          val !== null &&
          val !== '' &&
          // val !== false &&
          (valType === 'string' || valType === 'number' || valType === 'boolean')
        )
      })
      .forEach((key) => {
        dataProps[`data-sl-${key}`] = String(parameters[key].value)
      })
  }

  return dataProps
}
