<script lang="ts">
  import ControlsPanel from './lib/components/ControlsPanel.svelte'
  import PreviewWorkspace from './lib/components/PreviewWorkspace.svelte'
  import ProjectErrors from './lib/components/ProjectErrors.svelte'
  import StorySidebar from './lib/components/StorySidebar.svelte'
  import type { Route } from './lib/storylite/app-types'
  import { groupStories } from './lib/storylite/normalize'
  import {
    applyAppTheme,
    hydrateStoryLiteSettings,
    persistAppTheme,
    persistToolbarSettings,
    storyliteSettings,
  } from './lib/storylite/settings.svelte'
  import { applyManagerToolbarTargets } from './lib/storylite/toolbar-tools'
  import type { StoryArgs, StoryLiteStory } from './lib/storylite/types'
  import {
    globalCss,
    home,
    importedCss,
    isStaticBuild,
    previewHtml,
    projectUi,
    setupPreview,
    staticStoriesBase,
    stories,
    storyIdCollisions,
  } from './story-modules'

  const viewports = projectUi.viewports
  const backgrounds = projectUi.backgrounds

  hydrateStoryLiteSettings({
    defaultViewport: viewports[0]?.width ?? '100%',
    viewports: viewports.map((viewport) => viewport.width),
    defaultBackground: backgrounds[0]?.value ?? '#ffffff',
    backgrounds: backgrounds.map((background) => background.value),
    toolbarTools: projectUi.toolbar,
  })

  const initialRoute = readRoute()
  const initialStory = resolveStory(initialRoute.kind === 'home' ? undefined : initialRoute.storyId)

  let route: Route = $state(initialRoute)
  let selectedStoryId = $state(initialStory?.id ?? '')
  let activeArgs: StoryArgs = $state({ ...(initialStory?.args ?? {}) })
  let searchQuery = $state('')
  let reloadNonce = $state(0)

  const activeStory: StoryLiteStory | undefined = $derived(
    route.kind === 'home'
      ? undefined
      : (stories.find((story) => story.id === selectedStoryId) ?? stories[0]),
  )
  const normalizedQuery = $derived(searchQuery.trim().toLowerCase())
  const groups = $derived(
    groupStories(
      normalizedQuery
        ? stories.filter((story) =>
            `${story.title} ${story.name} ${story.renderer}`
              .toLowerCase()
              .includes(normalizedQuery),
          )
        : stories,
    ),
  )
  const isCanvasRoute = $derived(route.kind === 'canvas')
  const hasProjectErrors = $derived(storyIdCollisions.length > 0)
  const shouldShowSidebar = $derived(!storyliteSettings.maximized && !isCanvasRoute)
  const shouldShowControls = $derived(
    Boolean(activeStory) &&
      storyliteSettings.controlsVisible &&
      !storyliteSettings.maximized &&
      !isCanvasRoute &&
      !hasProjectErrors,
  )

  $effect(() => {
    applyAppTheme(storyliteSettings.appTheme)
    persistAppTheme()
  })

  $effect(() => {
    persistToolbarSettings()
  })

  $effect(() => {
    return applyManagerToolbarTargets(projectUi.toolbar, storyliteSettings.customTools)
  })

  $effect(() => {
    const css = projectUi.css.trim()

    if (!css) {
      document.getElementById('storylite-manager-custom-css')?.remove()
      return
    }

    const style = document.createElement('style')
    style.id = 'storylite-manager-custom-css'
    style.textContent = css
    document.getElementById(style.id)?.remove()
    document.head.append(style)

    return () => {
      style.remove()
    }
  })

  function updateArg(name: string, value: unknown): void {
    activeArgs = { ...activeArgs, [name]: value }
  }

  function resetArgs(): void {
    if (activeStory) {
      activeArgs = { ...activeStory.args }
    }
  }

  function selectStory(story: StoryLiteStory): void {
    setRoute({ kind: 'story', storyId: story.id })
  }

  function storyHref(story: StoryLiteStory): string {
    return isStaticBuild
      ? `${staticStoriesBase}${story.id}/`
      : `#/story/${encodeURIComponent(story.id)}`
  }

  function setRoute(nextRoute: Route): void {
    const hash = nextRoute.kind === 'home' ? '#/' : `#/${nextRoute.kind}/${nextRoute.storyId}`

    if (location.hash !== hash) {
      location.hash = hash
      return
    }

    applyRoute(nextRoute)
  }

  function handleHashChange(): void {
    applyRoute(readRoute())
  }

  function applyRoute(nextRoute: Route): void {
    route = nextRoute

    if (nextRoute.kind === 'home') {
      return
    }

    const nextStory = resolveStory(nextRoute.storyId)
    if (!nextStory) {
      return
    }

    selectedStoryId = nextStory.id
    activeArgs = { ...nextStory.args }
  }

  function readRoute(): Route {
    if (typeof location === 'undefined') {
      return home ? { kind: 'home' } : { kind: 'story', storyId: stories[0]?.id ?? '' }
    }

    const [hashPath] = (location.hash || '#/').split('?')
    const match = /^#\/(story|canvas)\/(.+)$/.exec(hashPath)
    if (match) {
      return { kind: match[1] as 'story' | 'canvas', storyId: decodeURIComponent(match[2]) }
    }

    return home ? { kind: 'home' } : { kind: 'story', storyId: stories[0]?.id ?? '' }
  }

  function resolveStory(storyId: string | undefined): StoryLiteStory | undefined {
    return stories.find((story) => story.id === storyId) ?? stories[0]
  }
</script>

<svelte:window onhashchange={handleHashChange} />

<main
  class="storylite-shell"
  class:storylite-shell--no-sidebar={!shouldShowSidebar}
  class:storylite-shell--no-controls={!shouldShowControls}
  class:storylite-shell--canvas={isCanvasRoute}
>
  {#if shouldShowSidebar}
    <StorySidebar
      {projectUi}
      {stories}
      {groups}
      activeStoryId={activeStory?.id}
      hasHome={Boolean(home)}
      isHomeActive={route.kind === 'home'}
      bind:searchQuery
      {storyHref}
      onSelectStory={selectStory}
    />
  {/if}

  {#if hasProjectErrors}
    <ProjectErrors idCollisions={storyIdCollisions} />
  {:else}
    <PreviewWorkspace
      {route}
      {activeStory}
      {activeArgs}
      {reloadNonce}
      {globalCss}
      {importedCss}
      {previewHtml}
      {setupPreview}
      {home}
      {isStaticBuild}
      {staticStoriesBase}
      {viewports}
      {backgrounds}
      toolbar={projectUi.toolbar}
    />
  {/if}

  {#if shouldShowControls}
    <ControlsPanel {activeStory} {activeArgs} onResetArgs={resetArgs} onUpdateArg={updateArg} />
  {/if}
</main>
