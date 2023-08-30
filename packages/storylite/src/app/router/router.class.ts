import React from 'react'

import { CurrentRoute, Route } from './router.types'
import {
  asAbsoluteHash,
  asRelativeHash,
  createPatternRegex,
  getWindowHash,
  parseHashbangPath,
  parsePathParams,
} from './router.utils'

export class Router implements Iterable<Route> {
  [Symbol.iterator](): Iterator<Route, any, undefined> {
    return this.routes[Symbol.iterator]()
  }
  public static readonly Hasbang = '/#/'
  private routes: Route[] = []
  private fallback?: React.FC
  private _currentRoute?: CurrentRoute

  get length(): number {
    return this.routes.length
  }

  get url(): URL | undefined {
    if (!this._currentRoute) {
      return undefined
    }

    const url = new URL(this._currentRoute.path, window.location.origin)
    url.search = this._currentRoute.query.toString()

    return url
  }

  get path(): string | undefined {
    if (!this._currentRoute) {
      return undefined
    }

    return this._currentRoute.path
  }

  get params(): URLSearchParams | undefined {
    if (!this._currentRoute) {
      return undefined
    }

    return this._currentRoute.params
  }

  get query(): URLSearchParams | undefined {
    if (!this._currentRoute) {
      return undefined
    }

    return this._currentRoute.query
  }

  get currentRoute(): CurrentRoute | undefined {
    return this._currentRoute
  }

  constructor() {
    this.refresh(getWindowHash())
    // console.log('Router', this._currentRoute)
  }

  back(): void {
    window.history.back()
  }

  forward(): void {
    window.history.forward()
  }

  isNotFound(): boolean {
    return this._currentRoute === undefined
  }

  navigate(path: string, query?: URLSearchParams | Record<string, string>, replace = false): void {
    // console.log('navigate', path)
    const absPath = asAbsoluteHash(path)
    const relPath = asRelativeHash(path)
    const newUrl = new URL(absPath, window.location.origin)
    newUrl.search = new URLSearchParams(query).toString()

    window.location.hash = relPath.toString()

    if (replace) {
      window.history.replaceState({ absPath }, '', absPath)

      return
    }
    window.history.pushState({ absPath }, '', absPath)
  }

  refresh(path: string): void {
    // console.log('refresh', path)
    const [pathPart, queryPart] = parseHashbangPath(path)

    const matches = this.getMatches(pathPart) // the last match takes precedence
    if (matches.length === 0) {
      this._currentRoute = undefined

      return
    }
    const route = matches[matches.length - 1]
    const params = parsePathParams(route.pattern ?? '', pathPart)
    const query = new URLSearchParams(queryPart)

    // assign query params to params
    Array.from(query.entries()).forEach(([key, value]) => {
      params.set(key, value)
    })

    this._currentRoute = {
      ...route,
      // component: route.component,
      path: path,
      params,
      query,
    }
  }

  register(onUpdate?: (router: Router) => void): () => void {
    const handleUpdate = (value: string) => {
      this.refresh(value)
      onUpdate?.(this) // re-enable to refresh the Children components
    }
    handleUpdate(getWindowHash())

    const handleHashChangeEvent = (e: HashChangeEvent) => {
      handleUpdate(e.newURL)
    }

    const handlePopstateEvent = (e: PopStateEvent) => {
      e.state?.absPath && handleUpdate(e.state.absPath)
    }

    window.addEventListener('hashchange', handleHashChangeEvent)
    window.addEventListener('popstate', handlePopstateEvent)

    return () => {
      window.removeEventListener('hashchange', handleHashChangeEvent)
      window.removeEventListener('popstate', handlePopstateEvent)
    }
  }

  add(pattern: string, component: React.FC): void {
    this.routes.push({ pattern, regex: createPatternRegex(pattern), component })
  }

  remove(pattern: string): void {
    this.routes = this.routes.filter(route => route.pattern !== pattern)
  }

  setFallback(component: React.FC): void {
    this.fallback = component
  }

  getFallback(): React.FC | undefined {
    return this.fallback
  }

  matches(path: string): boolean {
    return this.routes.some(route => route.regex.test(path))
  }

  getMatches(path: string): Route[] {
    return this.routes.filter(route => {
      return route.regex.test(path)
    })
  }
}
