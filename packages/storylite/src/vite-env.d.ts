/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.css?inline' {
  const css: string
  export default css
}

declare module 'virtual:storylite/project' {
  import type {
    StoryLiteBackgroundPreset,
    StoryLiteHtmlAttrs,
    StoryLiteMenuLink,
    StoryLiteToolbarTool,
  } from './public'
  import type { ViewportPreset } from './lib/storylite/app-types'
  import type {
    StoryIdResolver,
    StoryLiteClientRendererModule,
    StoryModule,
    StorySourceMetadataByImportPath,
  } from './lib/storylite/types'

  export type StoryLiteProjectUi = {
    readonly brand: {
      readonly markHtml: string
      readonly titleHtml: string
      readonly subtitle: string | null
    }
    readonly backgrounds: readonly StoryLiteBackgroundPreset[]
    readonly viewports: readonly ViewportPreset[]
    readonly toolbar: readonly StoryLiteToolbarTool[]
    readonly menuLinks: readonly StoryLiteMenuLink[]
    readonly css: string
  }

  export type StoryLitePreviewHtml = {
    readonly htmlAttrs: StoryLiteHtmlAttrs
    readonly bodyAttrs: StoryLiteHtmlAttrs
    readonly headHtml: string
    readonly bodyStartHtml: string
    readonly bodyEndHtml: string
  }

  export type StoryLiteManagerHtml = {
    readonly htmlAttrs: StoryLiteHtmlAttrs
    readonly bodyAttrs: StoryLiteHtmlAttrs
    readonly headHtml: string
    readonly bodyStartHtml: string
    readonly bodyEndHtml: string
  }

  export type StoryLiteHome = {
    readonly path: string
    readonly frontmatter: Record<string, unknown>
    readonly html: string
  } | null

  export const projectRoot: string
  export const storyModules: Record<string, StoryModule>
  export const storyModuleExportNames: Record<string, readonly string[]>
  export const storySourceMetadata: StorySourceMetadataByImportPath
  export const globalCss: readonly string[]
  export const importedCss: readonly string[]
  export const setupPreview: ((window: Window) => void) | undefined
  export const storyIdResolver: StoryIdResolver | undefined
  export const rendererClientLoaders: Record<string, () => Promise<StoryLiteClientRendererModule>>
  export const projectUi: StoryLiteProjectUi
  export const previewHtml: StoryLitePreviewHtml
  export const managerHtml: StoryLiteManagerHtml
  export const home: StoryLiteHome
  export const isStaticBuild: boolean
  export const staticStoriesBase: string
}
