import { Router } from './router.class'
import type { RouterPage } from './router.types'

export function createStoryLiteRouter(
  appRoutes: Record<string, RouterPage>,
  errorPage: RouterPage,
  defaultLayout: React.FC,
): Router {
  const router = new Router()
  const DefaultLayout = defaultLayout
  const Error404Layout = errorPage.Layout ?? defaultLayout
  const Error404Fc = errorPage.default as React.FC

  router.setFallback((props: any) => {
    return (
      <Error404Layout {...props}>
        <Error404Fc />
      </Error404Layout>
    )
  })

  for (const pattern of Object.keys(appRoutes)) {
    const page = appRoutes[pattern]
    if (!page || !page.default) {
      throw new Error(`Page with route '${pattern}' does not have a default JSX.Element export.`)
    }

    const LayoutFc = page.Layout ?? DefaultLayout
    const PageFc = page.default

    router.add(pattern, (props: any) => {
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
