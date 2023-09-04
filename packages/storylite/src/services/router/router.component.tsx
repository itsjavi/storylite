import { HTMLAttributes, ReactNode } from 'react'

import { useRouterStore } from './router.store'
import { CurrentRoute } from './router.types'

export type RouteRendererProps = {
  route?: CurrentRoute
  fallback?: React.FC
} & HTMLAttributes<HTMLDivElement>

export function RouteRenderer({ route, fallback, ...rest }: RouteRendererProps): ReactNode {
  let Component: React.FC | undefined
  const _props: Record<string, any> = { ...rest }

  if (route) {
    Component = route.component
    route.params.forEach((value, key) => {
      _props[key] = value
    })
  } else if (fallback) {
    Component = fallback
  }

  if (!Component) {
    throw new Error(`No route found for current path`)
  }

  return <Component {..._props} />
}

export const Link = ({
  to,
  children,
  ...rest
}: {
  to: string
  children?: React.ReactNode
  [key: string]: any
}) => {
  const navigate = useRouterStore(state => state.navigate)

  return (
    <a
      href={to}
      onClick={e => {
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
