import { ActionFunction, LoaderFunction } from 'react-router-dom'

export type PageType = {
  default?: React.FC
  Layout?: React.FC<any>
  loader?: LoaderFunction
  action?: ActionFunction
  ErrorBoundary?: JSX.Element
}

export type RouteType = {
  path: string
  Component: React.FC
  Layout: React.FC<any>
  loader?: LoaderFunction
  action?: ActionFunction
  ErrorBoundary?: React.FC
  status?: number
}
