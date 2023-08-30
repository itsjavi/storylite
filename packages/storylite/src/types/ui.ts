import { StoryLiteParamValue, StoryLiteStore } from '@/app/stores/global.types'
import { BtnProps } from '@/components/Btn'

import { SLNode } from './components'
import { SLNativeScalarType } from './core'

export enum SLCoreAddon {
  Grid = 'grid',
  Outline = 'outline',
  Responsive = 'responsive',
  ColorScheme = 'theme',
  Maximize = 'maximize',
  OpenStory = 'open',
  // AnimationsToggle = 'animations',
  // FullScreen = 'fullscreen',
  // Measure = 'measure',
  // Zoom = 'zoom',
  // Props = 'props',
}

export type SLAddonState = [
  value: StoryLiteParamValue | undefined,
  setValue: (
    value: Parameters<SLAddonContext['setParameter']>[1],
    options?: Parameters<SLAddonContext['setParameter']>[2],
  ) => void,
]

export type SLAddonContext = {
  parameters: StoryLiteStore['parameters']
  currentStory?: StoryLiteStore['currentStory']
  setParameter: StoryLiteStore['setParameter']
  canvas: StoryLiteStore['canvas']
}

/**
 * StoryLite Addons API.
 *
 * These are the props that will be passed to the ToolbarAddon components.
 */
export type SLAddonProps<Stateful = boolean> = {
  /**
   * Unique identifier for the addon.
   * It will be used to store the state in the local storage sl_parameters.
   */
  id: SLCoreAddon | string
  /**
   * HTML "title" attribute for the button.
   */
  tooltip?: string
  /**
   * Children of the button when the addon is not active.
   * If not provided, the render function will be used if defined, otherwise
   * default icons will be used.
   */
  defaultContent?: SLNode
  /**
   * Children of the button when the addon is active.
   * If not provided, the render function will be used if defined, otherwise
   * default icons will be used.
   */
  activeContent?: SLNode
  /**
   * Children not allowed, use defaultContent and activeContent instead.
   */
  children?: never
  /**
   * Whether the addon is stateful or not. If so, the functions will receive the state manager
   * array as the second argument.
   */
  stateful: Stateful
  /**
   * Whether the addon is persistent or not. If so, the state will be stored in the local storage.
   * This option only works if the addon is also `stateful`.
   */
  persistent?: Stateful extends true ? boolean : never
  /**
   * Default value for the state manager.
   */
  defaultValue?: Stateful extends true ? SLNativeScalarType | (() => SLNativeScalarType) : never
  /**
   * Props to pass to the button element.
   */
  buttonProps?: BtnProps
  /**
   * Where to place the addon in the toolbar.
   */
  placement?: 'left' | 'right'
  /**
   * Function to generate the href for the button (which will be a link)
   */
  getHref?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => string
    : (context: SLAddonContext) => string
  /**
   * Target for the button link.
   */
  hrefTarget?: string
  /**
   * Function to determine whether the addon is visible.
   */
  isVisible?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => boolean
    : (context: SLAddonContext) => boolean
  /**
   * Function to determine whether the addon is active or not.
   */
  isActive?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => boolean
    : (context: SLAddonContext) => boolean
  /**
   * Custom render function for the button children.
   * This will ignore the `children` prop, if set.
   */
  render?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => SLNode
    : (context: SLAddonContext) => SLNode
  /**
   * Function to call when the button is clicked.
   * This is the place where you can change the state, if the addon is stateful.
   */
  onClick?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => void | Promise<void>
    : (context: SLAddonContext) => void | Promise<void>
  /**
   * Function to call when the iframe is ready and its window loaded.
   */
  onIFrameReady?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => void | Promise<void>
    : (context: SLAddonContext) => void | Promise<void>

  onRender?: Stateful extends true
    ? (context: SLAddonContext, state: SLAddonState) => void | (() => void)
    : (context: SLAddonContext) => void | (() => void)
}

export type SLAddonPropsWithoutId<T extends boolean> = Omit<SLAddonProps<T>, 'id'>

// The id is defined in the map key, so we don't need to pass it in the value
export type SLAddonsMapWithoutId = Map<SLCoreAddon | string, SLAddonPropsWithoutId<boolean>>

export type SLAddonsMap = Map<SLCoreAddon | string, SLAddonProps<boolean>>

export type SLUserDefinedAddons = [
  id: SLCoreAddon | string,
  config: Omit<SLAddonProps<boolean>, 'id'> | false,
][]

export enum SLPanel {
  Sidebar = 'sidebar', // left sidebar
  Addons = 'addons', // top toolbar
  Canvas = 'canvas', // main content, iframe
  Properties = 'properties', // bottom toolbar
  Inspector = 'inspector', // right sidebar
}

export enum SLColorScheme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export type SLAddonPanel = SLPanel.Addons | SLPanel.Inspector
