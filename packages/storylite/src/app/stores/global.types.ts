import type {
  SLAddonsMap,
  SLAppComponentProps,
  SLParameters,
  SLUserDefinedAddons,
  StoryMap,
  StoryModuleMap,
} from '@/types'

export type StoryLiteCanvasState = {
  element: HTMLIFrameElement | null
  standalone: boolean
}

export type StoryLiteParamValue = string | string[] | number | number[] | boolean | undefined | null

export type StoryLiteState = {
  config: Required<SLAppComponentProps>
  canvas: StoryLiteCanvasState
  parameters: SLParameters
  addons: SLAddonsMap
  stories: StoryMap
  storyModuleMap: StoryModuleMap
  currentStoryId?: string
}

export type StoryLiteActions = {
  setParameter: (
    key: string,
    value: StoryLiteParamValue,
    options?: { persist?: boolean; crossWindow?: boolean },
  ) => void
  setParameters: (data: SLParameters, options?: { persist?: boolean; crossWindow?: boolean }) => void
  setCurrentStoryId: (storyId: string) => void
  setAddons: (addons: SLUserDefinedAddons) => void
  setStories: (stories: StoryModuleMap) => void
  setConfig: (config: Partial<SLAppComponentProps>) => void
  initialize: (config: Partial<SLAppComponentProps>, storyModules: StoryModuleMap) => void
  setCanvasElement: (element: HTMLIFrameElement | null) => void
}

export type StoryLiteStore = StoryLiteState & StoryLiteActions
