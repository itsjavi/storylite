//
// We have to import all pages manually, we are not in the Vite context here since it is a SPA,
// so we cannot use import.meta.glob like with Vite:
// const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<string, RouterPage>
//
import * as IndexPage from '@/pages/index'
import * as SandboxIndexPage from '@/pages/preview/index'
import * as SandboxStoryPage from '@/pages/preview/story'
import * as StoryPage from '@/pages/stories/story'
import type { RouterPage } from '@/services/router/router.types'

const appRoutes: Record<string, RouterPage> = {
  '/': IndexPage,
  '/preview': SandboxIndexPage,
  '/preview/stories/[storyId]': SandboxStoryPage,
  '/stories/[storyId]': StoryPage,
}

export { appRoutes }
