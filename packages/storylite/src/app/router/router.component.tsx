import { HTMLAttributes, ReactNode } from 'react'

import { useRouter } from './router.state'
import { CurrentRoute } from './router.types'
import { asAbsoluteHash, parseWindowHash } from './router.utils'

export type RouteComponentProps = {
  route?: CurrentRoute
  fallback?: React.FC
} & HTMLAttributes<HTMLDivElement>

export function RouteComponent({ route, fallback, ...rest }: RouteComponentProps): ReactNode {
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
    throw new Error(`No route found for path ${parseWindowHash()}`)
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
  const router = useRouter()

  return (
    <a
      href={asAbsoluteHash(to)}
      onClick={e => {
        e.preventDefault()
        router.navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
