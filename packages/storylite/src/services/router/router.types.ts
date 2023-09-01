import { Router } from './router.class'

export type Route = {
  pattern: string
  regex: RegExp
  component: React.FC
}

export type CurrentRoute = Route & {
  path: string
  params: URLSearchParams
  query: URLSearchParams
}

export type RouterPage = {
  default?: React.FC<any>
  Layout?: React.FC<any>
}

export type RouterContextState = {
  router: Router
  currentRoute?: CurrentRoute
}
