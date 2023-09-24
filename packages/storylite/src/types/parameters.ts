import type { SLNativeType } from './core'
import type { SLCoreAddon } from './ui'

export type SLParametersConfig = {
  [key: SLCoreAddon | `${SLCoreAddon}` | string]: {
    // values: Array<{
    //   name?: string
    //   value: SLNativeType
    // }>
    // hidden?: boolean
    // defaultValue?: SLNativeType
    value: SLNativeType
  }
}

export type SLParameters = {
  [key: SLCoreAddon | `${SLCoreAddon}` | string]: {
    value: SLNativeType
  }
}
