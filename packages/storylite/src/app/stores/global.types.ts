import {
  SLAddonsMap,
  SLAppComponentProps,
  SLParameters,
  SLUserDefinedAddons,
  StoryModulesMap,
} from '@/types'

export type StoryLiteCanvasState = {
  element: HTMLIFrameElement | null
  //   state: 'loading' | 'ready'
  standalone: boolean
}

export type StoryLiteCurrentStoryState = {
  uid: string
  story?: string
  exportName?: string
}

export type StoryLiteParamValue = string | string[] | number | number[] | boolean | undefined | null

export type StoryLiteState = {
  config: Required<SLAppComponentProps>
  canvas: StoryLiteCanvasState
  parameters: SLParameters
  addons: SLAddonsMap
  stories: StoryModulesMap
  currentStory?: StoryLiteCurrentStoryState
}

export type StoryLiteActions = {
  setParameter: (
    key: string,
    value: StoryLiteParamValue,
    options?: { persist?: boolean; crossWindow?: boolean },
  ) => void
  setParameters: (
    data: SLParameters,
    options?: { persist?: boolean; crossWindow?: boolean },
  ) => void
  setAddons: (addons: SLUserDefinedAddons) => void
  setStories: (stories: StoryModulesMap) => void
  setConfig: (config: Partial<SLAppComponentProps>) => void
  initialize: (config: Partial<SLAppComponentProps>, stories: StoryModulesMap) => void
  setCanvasElement: (element: HTMLIFrameElement | null) => void
}

export type StoryLiteStore = StoryLiteState & StoryLiteActions
