import React from 'react'

import { StoryLiteAppConfig, StoryModulesMap } from '..'

export type StoryliteDataContextType = {
  config?: StoryLiteAppConfig
  stories: StoryModulesMap
}

export const StoryliteDataContext = React.createContext<StoryliteDataContextType | undefined>(
  undefined,
)

export const useStoryliteDataContext = () => {
  const context = React.useContext(StoryliteDataContext)
  if (!context) {
    throw new Error('useStoryliteDataContext must be used within a StoryliteDataProvider')
  }

  return context
}

export const useStoryliteData = (): Required<StoryliteDataContextType> => {
  const { config, stories } = useStoryliteDataContext()

  if (!config) {
    throw new Error(
      'useStoryliteData must be used within a StoryliteDataProvider. config is undefined.',
    )
  }

  return { config, stories }
}

export const useStoryliteConfig = (): StoryLiteAppConfig => {
  const { config } = useStoryliteData()

  return config
}

export const useStoryliteStories = (): StoryModulesMap => {
  const { stories } = useStoryliteData()

  return stories
}

const defaultConfig: StoryLiteAppConfig = {
  title: 'Storylite',
  defaultStory: 'index',
  stylesheets: [],
}

export const StoryliteDataProvider = ({
  config,
  stories,
  children,
}: {
  config?: StoryLiteAppConfig
  stories: StoryModulesMap
  children: React.ReactNode
}) => {
  const mergedConfig: StoryLiteAppConfig = { ...defaultConfig, ...config }

  return (
    <StoryliteDataContext.Provider value={{ config: mergedConfig, stories }}>
      {children}
    </StoryliteDataContext.Provider>
  )
}
