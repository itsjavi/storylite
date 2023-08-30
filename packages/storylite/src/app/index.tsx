import { useEffect } from 'react'

import { createStoryLiteRouter } from '../services/router/router.factory'
import { RouterProvider } from '../services/router/router.state'
import { SLAppComponentProps, StoryModulesMap } from '../types'
import { useStoryLiteStore } from './stores/global'

export type StoryLiteAppProps = {
  config?: Partial<SLAppComponentProps>
  stories: StoryModulesMap
  children?: React.ReactNode
}

const router = createStoryLiteRouter()

export const StoryLiteApp = (props: StoryLiteAppProps) => {
  const { config, stories, children } = props
  const initialize = useStoryLiteStore(state => state.initialize)
  initialize(config || {}, stories)

  useEffect(() => {
    router.refresh(window.location.hash)
  }, [])

  return <RouterProvider router={router}>{children}</RouterProvider>
}
