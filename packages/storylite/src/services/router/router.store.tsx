import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { appRoutes } from '@/app/routes'
import TopFrameLayout from '@/components/layouts/TopFrameLayout'
import * as Error404 from '@/pages/404'

import { createStoryLiteRouter } from './createStoryLiteRouter'
import { CurrentRoute } from './router.types'

type State = {
  route?: CurrentRoute
  isNotFound: boolean
  params: {
    [key: string]: string | undefined
  }
  query: {
    [key: string]: string | undefined
  }
}

type Actions = {
  navigate: (path: string) => void
  initialize: () => () => void
  getFallback: () => React.FC | undefined
}

const router = createStoryLiteRouter(appRoutes, Error404, TopFrameLayout)

export const useRouterStore = createWithEqualityFn<State & Actions>(set => {
  router.refresh(window.location.hash)

  const buildState = (): State => {
    return {
      route: router.currentRoute ? { ...router.currentRoute } : undefined,
      isNotFound: router.currentRoute === undefined,
      params: Object.fromEntries(router.currentRoute?.params.entries() ?? []),
      query: Object.fromEntries(router.currentRoute?.query.entries() ?? []),
    }
  }

  const updateState = () => {
    set(() => {
      return buildState()
    })
  }

  return {
    ...buildState(),
    initialize: () => {
      router.refresh(window.location.hash)
      updateState()

      return router.register(updateState)
    },
    navigate: (path: string) => {
      router.navigate(path)
      updateState()
    },
    getFallback: () => router.getFallback(),
  }
}, shallow)

export function useRouterParams(): {
  [key: string]: string | undefined
} {
  return useRouterStore(state => state.params)
}

export function useRouterQuery(): {
  [key: string]: string | undefined
} {
  return useRouterStore(state => state.query)
}
