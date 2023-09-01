import { useEffect } from 'react'

import { RouteRenderer, useRouterStore } from '..'
import { SLAppComponentProps, StoryModuleMap } from '../types'
import { useStoryLiteStore } from './stores/global'

export type StoryLiteAppProps = {
  config?: Partial<SLAppComponentProps>
  stories: StoryModuleMap
  children?: React.ReactNode
}

export const StoryLiteApp = (props: StoryLiteAppProps) => {
  const { config, stories, children } = props
  const [initialize, setCurrentStoryId] = useStoryLiteStore(state => [
    state.initialize,
    state.setCurrentStoryId,
  ])

  const [route, getFallback, initializeRouter, routeParams] = useRouterStore(state => [
    state.route,
    state.getFallback,
    state.initialize,
    state.params,
  ])

  useEffect(() => {
    initialize(config || {}, stories)
    initializeRouter()
  }, [])

  useEffect(() => {
    if (routeParams.storyId) {
      setCurrentStoryId(routeParams.storyId)
    }
  }, [routeParams])

  return (
    <RouteRenderer fallback={getFallback()} route={route}>
      {children}
    </RouteRenderer>
  )
}
