import React, { useEffect } from 'react'

import { Router } from './router.class'
import { RouteComponent } from './router.component'
import { CurrentRoute, RouterContextState } from './router.types'

const RouterContext = React.createContext<RouterContextState | undefined>(undefined)

export const useRouter = (): Router => {
  const context = React.useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider')
  }

  return context.router
}

export const useCurrentRoute = (): CurrentRoute | undefined => {
  const context = React.useContext(RouterContext)

  return context?.currentRoute
}

export const useParams = (): {
  [key: string]: string | undefined
} => {
  const route = useCurrentRoute()

  const memoizedParams = React.useMemo(() => {
    return Object.fromEntries(route?.params?.entries() ?? [])
  }, [route?.params])

  return memoizedParams
}

export const useParamsMap = (): Map<string, string | undefined> => {
  const route = useCurrentRoute()

  const memoizedParams = React.useMemo(() => {
    return new Map(route?.params.entries())
  }, [route?.params])

  return memoizedParams
}

export const useSearchParamsMap = (): Map<string, string | undefined> => {
  const route = useCurrentRoute()

  const memoizedParams = React.useMemo(() => {
    return new Map(route?.query.entries())
  }, [route?.query])

  return memoizedParams
}

export const RouterProvider = ({
  router: router,
  children,
}: {
  router: Router
  children: React.ReactNode
}) => {
  router.refresh(window.location.hash)
  const [route, setRoute] = React.useState<CurrentRoute | undefined>(router.currentRoute)

  useEffect(() => {
    return router.register(rt => setRoute(rt.currentRoute))
  }, [router])

  return (
    <RouterContext.Provider value={{ router, currentRoute: route }}>
      <RouteComponent fallback={router.getFallback()} route={route}>
        {children}
      </RouteComponent>
    </RouterContext.Provider>
  )
}
