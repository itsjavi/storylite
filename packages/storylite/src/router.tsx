import React from 'react'
import {
  ActionFunction,
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Error404, { Layout as ErrorLayout } from './pages/404'

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

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<string, PageType>

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
    ? fileName.replace(/\$/g, ':')
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
  Component: Error404,
  Layout: ErrorLayout,
})

const router = createBrowserRouter(
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

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
