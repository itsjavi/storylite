import { useEffect } from 'react'

import { RouteRenderer, useRouterStore } from '..'
import { SLAppComponentProps, StoryModulesMap } from '../types'
import { useStoryLiteStore } from './stores/global'

export type StoryLiteAppProps = {
  config?: Partial<SLAppComponentProps>
  stories: StoryModulesMap
  children?: React.ReactNode
}

export const StoryLiteApp = (props: StoryLiteAppProps) => {
  const { config, stories, children } = props
  const initialize = useStoryLiteStore(state => state.initialize)

  const [route, getFallback, initializeRouter] = useRouterStore(state => [
    state.route,
    state.getFallback,
    state.initialize,
  ])

  useEffect(() => {
    initialize(config || {}, stories)
    initializeRouter()
  }, [])

  return (
    <RouteRenderer fallback={getFallback()} route={route}>
      {children}
    </RouteRenderer>
  )
}
