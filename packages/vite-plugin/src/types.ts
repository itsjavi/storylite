export type BaseStory = {
  title?: string
  name?: string
  component?: { (props?: any): any; displayName?: string }
  _isDefault?: boolean
  _moduleId?: string
  [key: string]: any
}

export type BaseStoryWithId = BaseStory & {
  id: string
}

export type FileModules = {
  default?: any
  [key: string]: any
}

export type StoryFiles = {
  [key: string]: FileModules
}

export type StoryFilesMap = Map<string, { [key: string]: BaseStoryWithId }>
