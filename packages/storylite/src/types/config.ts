import { SLNode } from './components'
import { SLUserDefinedAddons } from './ui'

// TODO: move to vite-plugin
// export type SLVitePluginConfig = {
//   // framework: 'react' | 'preact' | 'vue' | 'svelte' | 'solid' | 'qwik' | 'custom'
//   framework: 'react' | 'custom'
//   stories: string | string[]
//   staticDirs?: string[]
// }

export type SLAppComponentProps = {
  title: SLNode
  defaultStory: string
  iframeProps?: Omit<Record<string, any>, 'src'>
  useIframeStyles?: boolean
  themeAttribute?: string
  localStorageKey?: string
  children?: SLNode
  addons?: SLUserDefinedAddons
  // stylesheets: string[]
  // addons: StoryAddonList
}
