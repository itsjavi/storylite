import { RouterProvider } from 'react-router-dom'

import { SLAppComponentProps, StoryModulesMap } from '../types'
import { StoryLiteDataProvider } from './context/StoriesDataContext'
import { createStoryLiteRouter } from './createStoryLiteRouter'

const router = createStoryLiteRouter()

export type StoryLiteAppProps = {
  config?: Partial<SLAppComponentProps>
  stories: StoryModulesMap
}

export const StoryLiteApp = (props: StoryLiteAppProps) => {
  const { config, stories } = props

  return (
    <StoryLiteDataProvider config={config} stories={stories}>
      <RouterProvider router={router} />
    </StoryLiteDataProvider>
  )
}
