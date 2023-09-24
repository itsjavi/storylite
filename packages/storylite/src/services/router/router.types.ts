import type { Router } from './router.class'

export type Route = {
  pattern: string
  regex: RegExp
  component: React.FC
}

export type ParsedUri = {
  basePath?: string
  hashPath: string
  params: URLSearchParams
  query: URLSearchParams
}

export type CurrentRoute = Route & ParsedUri

export type RouterPage = {
  default?: React.FC<any>
  Layout?: React.FC<any>
}

export type RouterContextState = {
  router: Router
  currentRoute?: CurrentRoute
}
