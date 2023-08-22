import React from 'react'
import { ActionFunction, createHashRouter, LoaderFunction, RouterProvider } from 'react-router-dom'

import { StoryliteDataContext } from './context/StoriesDataContext'
import MainLayout from './layouts/MainLayout'
import Error404, { Layout as ErrorLayout } from './pages/404'
import * as IndexPage from './pages/index'
import * as SandboxDashboardPage from './pages/sandbox/dashboard'
import * as SandboxStoryIndex from './pages/sandbox/stories/$story'
import * as SandboxExportedStory from './pages/sandbox/stories/$story/$export_name'
import * as ExportedStory from './pages/stories/$story/$export_name'
import { StoryLiteAppConfig, StoryModulesMap } from './types'

type PageType = {
  default?: React.FC
  Layout?: React.FC<any>
  loader?: LoaderFunction
  action?: ActionFunction
  ErrorBoundary?: JSX.Element
}

type RouteType = {
  path: string
  Component: React.FC
  Layout: React.FC<any>
  loader?: LoaderFunction
  action?: ActionFunction
  ErrorBoundary?: React.FC
  status?: number
}

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
  Component: () => <>Noooo</>,
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

const StoryLiteApp = (props: { config?: StoryLiteAppConfig; stories: StoryModulesMap }) => {
  return (
    <StoryliteDataContext.Provider value={{ config: props.config, stories: props.stories }}>
      <RouterProvider router={router} />
    </StoryliteDataContext.Provider>
  )
}

export default StoryLiteApp
