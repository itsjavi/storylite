import { SLNativeType } from './core'
import { SLCoreAddon } from './ui'

export type SLParametersConfig = {
  [key: string | SLCoreAddon | `${SLCoreAddon}`]: {
    values: Array<{
      name?: string
      value: SLNativeType
    }>
    hidden?: boolean
    defaultValue?: SLNativeType
  }
}

export type SLParameters = {
  [key: string | SLCoreAddon | `${SLCoreAddon}`]: {
    hidden?: boolean
    value: SLNativeType
  }
}
