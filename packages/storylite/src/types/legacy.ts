import React from 'react'

export type StoryLitePluginConfig = {
  stories: string
}

export type StoryLiteAppConfig = {
  title: React.ReactNode
  defaultStory: string
  // stylesheets: string[]
  // addons: StoryAddonList
}

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
  expandedIcon?: React.ReactNode
  onClick?: () => void
}

// export type StoryAddonList = (StoryAddon | [StoryAddon, StoryAddonSettings] | StoryAddonSettings)[]

export type StoryComponent<P = any> = React.FC<P> & {
  args?: any
  argTypes?: any
  storyTitle?: string
}

export type StoryMeta = {
  title?: React.ReactNode
  icon?: React.ReactNode
  expandedIcon?: React.ReactNode
  priority?: number
  // addons?: StoryAddonList
}

export type StoryModule<P = any> = {
  [key: string]: StoryComponent<P>
} & {
  default?: StoryMeta
}

export type StoryModulesMapValue = { module: StoryModule; meta: StoryMeta }
export type StoryModulesMap = Map<string, StoryModulesMapValue>

export enum ElementIds {
  Sidebar = 'storylite__sidebar',
  StoryCanvas = 'storylite__story_canvas',
}

export enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}
