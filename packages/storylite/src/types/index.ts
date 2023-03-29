import { UserConfig } from 'vite'

import React from 'react'

export enum ElementIds {
  MainGlobalStyles = 'stories_mainLayoutGlobalStyles',
  SandboxGlobalStyles = 'stories_sandboxLayoutGlobalStyles',
  Iframe = 'stories_Iframe',
  Sidebar = 'stories_Sidebar',
  StoryCanvas = 'stories_Canvas',
}

export type StoryLiteUserConfig = {
  title?: React.ReactNode
  stories?: string | string[]
  defaultStory: string
  addons?: StoryAddonList
  vite?: UserConfig
  styles?: {
    ui: string[]
    sandbox: string[]
  }
}

export type StoryLiteUserConfigExport = Required<StoryLiteUserConfig>

export enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export type StoryImportPaths = [string, string][]

export enum StoryAddon {
  DarkMode = 'DarkMode',
  FullScreen = 'FullScreen',
  Grid = 'Grid',
  Measure = 'Measure',
  Outline = 'Outline',
  Props = 'Props',
  Responsive = 'Responsive',
  SourceCode = 'SourceCode',
  Zoom = 'Zoom',
}

export type StoryAddonSettings = {
  id?: StoryAddon | string
  tooltip?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export type StoryAddonList = (StoryAddon | [StoryAddon, StoryAddonSettings] | StoryAddonSettings)[]

export type StoryComponent<P = any> = React.FC<P> & {
  args?: any
  argTypes?: any
  storyTitle?: string
}

export type StoryMeta = {
  title?: string
  icon?: JSX.Element
  addons?: StoryAddonList
  priority?: number
}

export type StoryModule<P = any> = {
  [key: string]: StoryComponent<P>
} & {
  default?: StoryMeta
}

export type StoryModulesMapValue = { module: StoryModule; meta: StoryMeta }
export type StoryImportGlob = Record<string, StoryModule>
export type StoryModulesMap = Map<string, StoryModulesMapValue>
