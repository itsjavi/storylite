import React from 'react'
import { ActionFunction, createHashRouter, LoaderFunction } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
// import all pages manually (we are not in the Vite context here, so we cannot use import.meta.glob)
import Error404, { Layout as ErrorLayout } from '../pages/404'
import * as IndexPage from '../pages/index'
import * as SandboxDashboardPage from '../pages/sandbox/dashboard'
import * as SandboxStoryIndex from '../pages/sandbox/stories/$story'
import * as SandboxExportedStory from '../pages/sandbox/stories/$story/$export_name'
import * as ExportedStory from '../pages/stories/$story/$export_name'
import { PageType, RouteType } from '../types/app'

export function createStoryLiteRouter(): ReturnType<typeof createHashRouter> {
  // const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<string, PageType>
  const pages: Record<string, PageType> = {
    './pages/sandbox/stories/$story/$export_name.tsx': SandboxExportedStory,
    './pages/sandbox/stories/$story/index.tsx': SandboxStoryIndex,
    './pages/sandbox/dashboard.tsx': SandboxDashboardPage,
    './pages/stories/$story/$export_name.tsx': ExportedStory,
    './pages/index.tsx': IndexPage,
    './pages/404.tsx': {
      default: Error404,
      Layout: ErrorLayout,
    },
  }

  const routes: RouteType[] = []
  for (const path of Object.keys(pages)) {
    const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1]
    if (!fileName) {
      continue
    }

    const page = pages[path]
    if (!page || !page.default) {
      throw new Error(`Page ${path} does not have a default JSX.Element export.`)
    }

    const normalizedPathName = fileName.includes('$')
      ? fileName.replace(/\$/g, ':').replace(/\/index/, '')
      : fileName.replace(/\/index/, '')

    routes.push({
      path: fileName === 'index' ? '/' : `/${normalizedPathName.toLowerCase()}`,
      Component: page.default,
      Layout: page.Layout || MainLayout,
      loader: page.loader as unknown as LoaderFunction | undefined,
      action: page.action as unknown as ActionFunction | undefined,
      ErrorBoundary: page.ErrorBoundary as unknown as React.FC,
    })
  }

  if (routes.length === 0) {
    const h1 = document.createElement('h1')
    h1.innerText = 'Router error: No routes found'
    document.body.appendChild(h1)
    throw new Error(h1.innerText)
  }

  routes.push({
    path: '*',
    status: 404,
    Component: () => <h1>Router error: route not found</h1>,
    Layout: ErrorLayout,
  })

  const router = createHashRouter(
    routes.map(({ Component, Layout, ErrorBoundary, ...rest }) => ({
      ...rest,
      element: Layout ? (
        <Layout>
          <Component />
        </Layout>
      ) : (
        <Component />
      ),
      ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
    })),
  )

  return router
}
