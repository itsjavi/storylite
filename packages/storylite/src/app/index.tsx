import { useEffect } from 'react'

import { SLAppComponentProps, StoryModulesMap } from '../types'
import { StoryLiteStateProvider } from './context/StoriesDataContext'
import { createStoryLiteRouter } from './router/router.factory'
import { RouterProvider } from './router/router.state'

// const router = createStoryLiteRouter()
const router = createStoryLiteRouter()
// router.setFallback(() => <div>This is an error!</div>)
router.add('/test', () => <div>testing...</div>)

export type StoryLiteAppProps = {
  config?: Partial<SLAppComponentProps>
  stories: StoryModulesMap
  children?: React.ReactNode
}

export const StoryLiteApp = (props: StoryLiteAppProps) => {
  const { config, stories, children } = props

  useEffect(() => {
    router.refresh(window.location.hash)
  }, [])

  return (
    <StoryLiteStateProvider config={config} stories={stories}>
      <RouterProvider router={router}>{children}</RouterProvider>
    </StoryLiteStateProvider>
  )
}
