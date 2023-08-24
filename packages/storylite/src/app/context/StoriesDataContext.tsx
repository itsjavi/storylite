import React from 'react'

import { Library } from 'lucide-react'

import { SLAppComponentProps, StoryModulesMap } from '../..'

export type StoryLiteDataContextType = {
  config?: SLAppComponentProps
  stories: StoryModulesMap
}

const StoryLiteDataContext = React.createContext<StoryLiteDataContextType | undefined>(undefined)

export const useStoryLiteDataContext = () => {
  const context = React.useContext(StoryLiteDataContext)
  if (!context) {
    throw new Error('useStoryLiteDataContext must be used within a StoryLiteDataProvider')
  }

  return context
}

export const useStoryLiteData = (): Required<StoryLiteDataContextType> => {
  const { config, stories } = useStoryLiteDataContext()

  if (!config) {
    throw new Error(
      'useStoryLiteData must be used within a StoryLiteDataProvider. config is undefined.',
    )
  }

  return { config, stories }
}

export const useStoryLiteConfig = (): SLAppComponentProps => {
  const { config } = useStoryLiteData()

  return config
}

export const useStoryLiteStories = (): StoryModulesMap => {
  const { stories } = useStoryLiteData()

  return stories
}

export const defaultConfig: SLAppComponentProps = {
  title: (
    <>
      <Library style={{ verticalAlign: 'middle' }} /> StoryLite ⚡️
    </>
  ),
  defaultStory: 'index',
  // stylesheets: [],
}

export const StoryLiteDataProvider = ({
  config,
  stories,
  children,
}: {
  config?: Partial<SLAppComponentProps>
  stories: StoryModulesMap
  children: React.ReactNode
}) => {
  const mergedConfig: SLAppComponentProps = { ...defaultConfig, ...config }

  return (
    <StoryLiteDataContext.Provider value={{ config: mergedConfig, stories }}>
      {children}
    </StoryLiteDataContext.Provider>
  )
}
