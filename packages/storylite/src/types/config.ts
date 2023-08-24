import { SLNode } from './components'

// TODO: move to vite-plugin
// export type SLVitePluginConfig = {
//   // framework: 'react' | 'preact' | 'vue' | 'svelte' | 'solid' | 'qwik' | 'custom'
//   framework: 'react' | 'custom'
//   stories: string | string[]
//   staticDirs?: string[]
// }

export type SLAppComponentProps = {
  title: SLNode
  icon?: SLNode
  defaultStory: string
  // stylesheets: string[]
  // addons: StoryAddonList
}
