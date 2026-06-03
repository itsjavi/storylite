import { applyBundle, bootstrapPreview } from '@storylite/preview-host'
import type { StoryLiteHtmlAttrs } from '../../public'
import type {
  MountedStory,
  StoryArgs,
  StoryContext,
  StoryLiteClientRenderer,
  StoryLiteClientRendererModule,
  StoryLiteStory,
} from '../storylite/types'

export type PreviewHtmlOptions = {
  readonly htmlAttrs: StoryLiteHtmlAttrs
  readonly bodyAttrs: StoryLiteHtmlAttrs
  readonly headHtml: string
  readonly bodyStartHtml: string
  readonly bodyEndHtml: string
}

export type PreviewOptions = {
  readonly background: string
  readonly theme: 'light' | 'dark'
  readonly globalCss?: readonly string[]
  readonly importedCss?: readonly string[]
  readonly html?: PreviewHtmlOptions
  readonly setupPreview?: (window: Window) => void
  readonly rendererClientLoaders?: StoryLiteRendererClientLoaders
}

export type CanvasRenderOptions = {
  readonly globalCss?: readonly string[]
  readonly importedCss?: readonly string[]
  readonly setupPreview?: (window: Window) => void
  readonly rendererClientLoaders?: StoryLiteRendererClientLoaders
}

export type { MountedStory }

export type StoryLiteRendererClientLoaders = Record<
  string,
  () => Promise<StoryLiteClientRendererModule>
>

export function preparePreview(
  iframe: HTMLIFrameElement,
  story: StoryLiteStory,
  options: PreviewOptions,
): StoryContext {
  const parts = bootstrapPreview(iframe, {
    title: `${story.title} - ${story.name}`,
    colorScheme: options.theme,
    htmlAttrs: options.html?.htmlAttrs,
    bodyAttrs: options.html?.bodyAttrs,
    headHtml: options.html?.headHtml,
    bodyStartHtml: options.html?.bodyStartHtml,
    bodyEndHtml: options.html?.bodyEndHtml,
  })

  options.setupPreview?.(parts.document.defaultView ?? iframe.contentWindow ?? window)

  const css = collectPreviewCss(options, story)
  applyBundle(iframe, {
    'tokens.css': previewBaseCss(options),
    'components.css': css,
  })

  parts.document.documentElement.dataset.theme = options.theme
  applyPreviewBackground(parts.document.body, story.parameters.background ?? options.background)

  return {
    id: story.id,
    title: story.title,
    name: story.name,
    canvas: parts.canvas,
    document: parts.document,
    window: parts.document.defaultView ?? iframe.contentWindow ?? window,
  }
}

export function renderStory(
  iframe: HTMLIFrameElement,
  story: StoryLiteStory,
  args: StoryArgs,
  options: PreviewOptions,
): Promise<MountedStory> {
  const context = preparePreview(iframe, story, options)
  return renderStoryIntoCanvas(story, args, context, options.rendererClientLoaders)
}

export function renderStoryIntoDocument(
  document: Document,
  canvas: HTMLElement,
  story: StoryLiteStory,
  args: StoryArgs,
  options: CanvasRenderOptions = {},
): Promise<MountedStory> {
  const win = document.defaultView ?? window
  options.setupPreview?.(win)
  applyInlinePreviewCss(document, collectPreviewCss(options, story))
  document.documentElement.dataset.theme = 'light'

  return renderStoryIntoCanvas(
    story,
    args,
    {
      id: story.id,
      title: story.title,
      name: story.name,
      canvas,
      document,
      window: win,
    },
    options.rendererClientLoaders,
  )
}

export async function renderStoryIntoCanvas(
  story: StoryLiteStory,
  args: StoryArgs,
  context: StoryContext,
  rendererClientLoaders: StoryLiteRendererClientLoaders = {},
): Promise<MountedStory> {
  switch (story.renderer) {
    case 'web-components':
      return renderWebComponentStory(story, args, context)
    case 'html':
      return renderHtmlStory(story, args, context)
    default:
      return renderCustomStory(story, args, context, rendererClientLoaders)
  }
}

export function renderHtmlStory(
  story: StoryLiteStory,
  args: StoryArgs,
  context: StoryContext,
): MountedStory {
  const output = story.render?.(args, context)

  context.canvas.replaceChildren()

  if (typeof output === 'string') {
    const template = context.document.createElement('template')
    template.innerHTML = output
    context.canvas.append(template.content)
  } else if (isNodeLike(output)) {
    context.canvas.append(output)
  } else if (output !== undefined && output !== null) {
    throw new Error(`Story "${story.name}" returned unsupported HTML renderer output.`)
  }

  return { cleanup: () => clearCanvasForContext(context) }
}

export function renderWebComponentStory(
  story: StoryLiteStory,
  args: StoryArgs,
  context: StoryContext,
): MountedStory {
  story.parameters.defineCustomElements?.(context.window)

  if (story.render) {
    return renderHtmlStory(story, args, context)
  }

  if (typeof story.component !== 'string') {
    throw new Error(
      `Story "${story.name}" needs a string component tag for web-component rendering.`,
    )
  }

  const element = context.document.createElement(story.component)
  applyArgsToElement(element, args)
  context.canvas.replaceChildren(element)

  return { cleanup: () => clearCanvasForContext(context) }
}

export async function renderCustomStory(
  story: StoryLiteStory,
  args: StoryArgs,
  context: StoryContext,
  rendererClientLoaders: StoryLiteRendererClientLoaders,
): Promise<MountedStory> {
  const loadRenderer = rendererClientLoaders[story.renderer]

  if (!loadRenderer) {
    throw new Error(
      `Story "${story.name}" uses renderer "${story.renderer}", but no matching renderer adapter is registered.`,
    )
  }

  const module = await loadRenderer()
  const render = resolveClientRenderer(module, story.renderer)
  return render(story, args, context)
}

function resolveClientRenderer(
  module: StoryLiteClientRendererModule,
  renderer: string,
): StoryLiteClientRenderer {
  if (typeof module.renderStory === 'function') {
    return module.renderStory
  }

  if (typeof module.default === 'function') {
    return module.default
  }

  if (typeof module.default?.renderStory === 'function') {
    return module.default.renderStory
  }

  throw new Error(`Renderer adapter "${renderer}" does not export a renderStory function.`)
}

export function applyArgsToElement(element: Element, args: StoryArgs): void {
  for (const [key, value] of Object.entries(args)) {
    ;(element as unknown as Record<string, unknown>)[key] = value

    const attribute = kebabCase(key)
    if (value === false || value === null || value === undefined) {
      element.removeAttribute(attribute)
    } else if (value === true) {
      element.setAttribute(attribute, '')
    } else if (isPrimitive(value)) {
      element.setAttribute(attribute, String(value))
    }
  }

  if (!element.textContent?.trim() && typeof args.label === 'string') {
    element.textContent = args.label
  }
}

function collectCss(story: StoryLiteStory): string {
  const css = story.parameters.css

  return typeof css === 'string' ? css : (css?.join('\n\n') ?? '')
}

export function collectPreviewCss(
  options: Pick<PreviewOptions, 'globalCss' | 'importedCss'>,
  story: StoryLiteStory,
): string {
  return [...(options.globalCss ?? []), ...(options.importedCss ?? []), collectCss(story)]
    .filter(Boolean)
    .join('\n\n')
}

function applyInlinePreviewCss(document: Document, css: string): void {
  let style = document.getElementById('storylite-ejected-story-css') as HTMLStyleElement | null

  if (!style) {
    style = document.createElement('style')
    style.id = 'storylite-ejected-story-css'
    document.head.append(style)
  }

  style.textContent = css
}

function previewBaseCss(options: PreviewOptions): string {
  return `:root {
  color-scheme: ${options.theme};
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: ${options.background};
  --storylite-grid-size: 1rem;
  --storylite-grid-major-size: calc(var(--storylite-grid-size) * 8);
  --storylite-grid-offset: 16px;
  --storylite-grid-line-width: 1px;
  --storylite-grid-line-color: rgb(130 130 130 / 35%);
  --storylite-grid-line-color-2: rgb(130 130 130 / 17.5%);
  --storylite-grid-background-color: light-dark(#f7f7f7, #111111);
}

* {
  box-sizing: border-box;
}

body {
  min-block-size: 100dvh;
  margin: 0;
}

#ss-canvas {
  min-block-size: 100dvh;
  padding: 16px;
}`
}

function applyPreviewBackground(body: HTMLElement, background: string): void {
  body.style.background = background
  body.style.backgroundBlendMode = background.includes('--storylite-grid-')
    ? 'difference, difference, difference, difference, normal'
    : ''
}

function clearCanvasForContext(context: StoryContext): void {
  context.canvas.replaceChildren()
}

function isNodeLike(value: unknown): value is Node | DocumentFragment {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    typeof (value as { nodeType?: unknown }).nodeType === 'number'
  )
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return ['string', 'number', 'boolean'].includes(typeof value)
}

function kebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}
