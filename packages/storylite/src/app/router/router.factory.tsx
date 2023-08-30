import TopFrameLayout from '../../components/layouts/TopFrameLayout'
import * as Error404 from '../../pages/404'
// import all pages manually (we are not in the Vite context here; cannot use import.meta.glob)
import * as IndexPage from '../../pages/index'
import * as SandboxDashboardPage from '../../pages/preview/dashboard'
import * as SandboxStoryIndex from '../../pages/preview/stories/[story]'
import * as SandboxExportedStory from '../../pages/preview/stories/[story]/[export_name]'
import * as ExportedStory from '../../pages/stories/[story]/[export_name]'
import { Router } from './router.class'
import { RouterPage } from './router.types'

export function createStoryLiteRouter(): Router {
  const router = new Router()
  const Error404Fc = Error404.default

  router.setFallback((props: any) => {
    return (
      <Error404.Layout {...props}>
        <Error404Fc />
      </Error404.Layout>
    )
  })

  // const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<string, RouterPage>
  const pages: Record<string, RouterPage> = {
    './pages/index.tsx': IndexPage,
    './pages/preview/dashboard.tsx': SandboxDashboardPage,
    './pages/preview/stories/[story]/[export_name].tsx': SandboxExportedStory,
    './pages/preview/stories/[story]/index.tsx': SandboxStoryIndex,
    './pages/stories/[story]/[export_name].tsx': ExportedStory,
  }

  for (const path of Object.keys(pages)) {
    const routePattern = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1]
    if (!routePattern) {
      continue
    }

    const page = pages[path]
    if (!page || !page.default) {
      throw new Error(`Page ${path} does not have a default JSX.Element export.`)
    }

    const normalizedPattern = routePattern.replace(/\/index$/, '').replace(/^index$/, '')
    const LayoutFc = page.Layout ?? TopFrameLayout
    const PageFc = page.default

    router.add(normalizedPattern, (props: any) => {
      return (
        <LayoutFc {...props}>
          <PageFc {...props} />
          {props?.children}
        </LayoutFc>
      )
    })
  }

  if (router.length === 0) {
    throw new Error('Router error: No routes found')
  }

  return router
}
