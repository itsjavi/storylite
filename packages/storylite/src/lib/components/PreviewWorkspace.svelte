<script lang="ts">
  import { onDestroy, untrack } from 'svelte'
  import type { StoryLiteBackgroundPreset } from '../../public'
  import {
    renderStory,
    renderStoryIntoDocument,
    type MountedStory,
    type PreviewHtmlOptions,
  } from '../renderers/runtime'
  import { rendererClientLoaders } from '../../story-modules'
  import type { StoryLiteToolbarTool } from '../../public'
  import type { Route, ViewportPreset } from '../storylite/app-types'
  import { storyliteSettings } from '../storylite/settings.svelte'
  import { applyPreviewToolbarTargets } from '../storylite/toolbar-tools'
  import type { StoryArgs, StoryLiteStory } from '../storylite/types'
  import WorkbenchToolbar from './WorkbenchToolbar.svelte'

  type HomePage = {
    readonly html: string
  } | null

  type Props = {
    readonly route: Route
    readonly activeStory: StoryLiteStory | undefined
    readonly activeArgs: StoryArgs
    readonly reloadNonce: number
    readonly globalCss: readonly string[]
    readonly importedCss: readonly string[]
    readonly previewHtml: PreviewHtmlOptions
    readonly setupPreview: ((window: Window) => void) | undefined
    readonly home: HomePage
    readonly isStaticBuild: boolean
    readonly staticStoriesBase: string
    readonly viewports: readonly ViewportPreset[]
    readonly backgrounds: readonly StoryLiteBackgroundPreset[]
    readonly toolbar: readonly StoryLiteToolbarTool[]
  }

  let {
    route,
    activeStory,
    activeArgs,
    reloadNonce,
    globalCss,
    importedCss,
    previewHtml,
    setupPreview,
    home,
    isStaticBuild,
    staticStoriesBase,
    viewports,
    backgrounds,
    toolbar,
  }: Props = $props()

  let iframe: HTMLIFrameElement | undefined = $state()
  let directCanvas: HTMLElement | undefined = $state()
  let renderError: string | null = $state(null)
  let mountedStory: MountedStory | null = null
  let renderToken = 0

  const isCanvasRoute = $derived(route.kind === 'canvas')
  const isFluidViewport = $derived(storyliteSettings.viewport === '100%')
  const activeViewport = $derived(
    viewports.find((viewport) => viewport.width === storyliteSettings.viewport),
  )
  const viewportBadgeText = $derived(
    activeViewport && activeViewport.icon !== 'fluid'
      ? `${activeViewport.label} ${activeViewport.width}`
      : '',
  )

  function applyIframeZoom(targetIframe: HTMLIFrameElement, zoom: number): void {
    targetIframe.contentDocument?.body.style.setProperty('zoom', String(zoom / 100))
  }

  onDestroy(() => {
    renderToken += 1
    void mountedStory?.cleanup()
  })

  $effect(() => {
    if (!iframe || !activeStory || isCanvasRoute) {
      return
    }

    const currentIframe = iframe
    const renderCycle = reloadNonce
    const args = { ...activeArgs }
    const options = {
      theme: storyliteSettings.previewTheme,
      background: storyliteSettings.background,
      globalCss,
      importedCss,
      html: previewHtml,
      setupPreview,
    }
    void renderCycle

    const token = ++renderToken

    try {
      void mountedStory?.cleanup()
      mountedStory = null
      const renderedStory = renderStory(currentIframe, activeStory, args, {
        ...options,
        rendererClientLoaders,
      })
      applyIframeZoom(
        currentIframe,
        untrack(() => storyliteSettings.zoom),
      )
      renderedStory.then(
        (nextMountedStory) => {
          if (token !== renderToken) {
            void nextMountedStory.cleanup()
            return
          }

          mountedStory = nextMountedStory
          if (currentIframe.contentDocument?.body) {
            applyPreviewToolbarTargets(
              currentIframe.contentDocument.body,
              toolbar,
              storyliteSettings.customTools,
            )
          }
          renderError = null
        },
        (error: unknown) => {
          if (token === renderToken) {
            renderError = error instanceof Error ? error.message : String(error)
          }
        },
      )
      renderError = null
    } catch (error) {
      renderError = error instanceof Error ? error.message : String(error)
    }

    return () => {
      void mountedStory?.cleanup()
      mountedStory = null
    }
  })

  $effect(() => {
    if (!directCanvas || !activeStory || !isCanvasRoute) {
      return
    }

    const currentCanvas = directCanvas
    const renderCycle = reloadNonce
    const args = { ...activeArgs }
    void renderCycle

    const token = ++renderToken

    try {
      void mountedStory?.cleanup()
      mountedStory = null
      const renderedStory = renderStoryIntoDocument(document, currentCanvas, activeStory, args, {
        globalCss,
        importedCss,
        setupPreview,
        rendererClientLoaders,
      })
      renderedStory.then(
        (nextMountedStory) => {
          if (token !== renderToken) {
            void nextMountedStory.cleanup()
            return
          }

          mountedStory = nextMountedStory
          applyPreviewToolbarTargets(currentCanvas, toolbar, storyliteSettings.customTools)
          renderError = null
        },
        (error: unknown) => {
          if (token === renderToken) {
            renderError = error instanceof Error ? error.message : String(error)
          }
        },
      )
      renderError = null
    } catch (error) {
      renderError = error instanceof Error ? error.message : String(error)
    }

    return () => {
      void mountedStory?.cleanup()
      mountedStory = null
    }
  })

  $effect(() => {
    if (iframe && !isCanvasRoute) {
      applyIframeZoom(iframe, storyliteSettings.zoom)
    }
  })

  $effect(() => {
    const customTools = storyliteSettings.customTools

    if (iframe?.contentDocument?.body && !isCanvasRoute) {
      applyPreviewToolbarTargets(iframe.contentDocument.body, toolbar, customTools)
    }

    if (directCanvas && isCanvasRoute) {
      applyPreviewToolbarTargets(directCanvas, toolbar, customTools)
    }
  })
</script>

<section class="workspace" aria-label="Preview workspace">
  {#if route.kind === 'home' && home}
    <article class="home-page">{@html home.html}</article>
  {:else if isCanvasRoute}
    <div
      class="ejected-canvas"
      bind:this={directCanvas}
      aria-label="Standalone story preview"
    ></div>
    {#if renderError}
      <p class="error" role="status">{renderError}</p>
    {/if}
  {:else}
    <WorkbenchToolbar
      {viewports}
      {backgrounds}
      {activeStory}
      hasHome={Boolean(home)}
      {isStaticBuild}
      {staticStoriesBase}
      {toolbar}
    />

    <div class="workspace__body">
      <div class="canvas-stage" class:canvas-stage--fluid={isFluidViewport}>
        {#if viewportBadgeText}
          <span class="viewport-badge" aria-hidden="true">{viewportBadgeText}</span>
        {/if}

        <div
          class="canvas-frame"
          class:canvas-frame--fluid={isFluidViewport}
          style:width={storyliteSettings.viewport}
          aria-label="Isolated story preview"
        >
          <iframe bind:this={iframe} title="StoryLite isolated preview"></iframe>
        </div>
      </div>

      {#if renderError}
        <p class="error" role="status">{renderError}</p>
      {/if}
    </div>
  {/if}
</section>
