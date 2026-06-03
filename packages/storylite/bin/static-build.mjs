import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import fg from 'fast-glob'
import { createServer } from 'vite'
import { fileUrl, storyPagePath } from './project-graph.mjs'
import { transformBuiltManagerHtml } from './customization.mjs'
import {
  escapeAttribute,
  escapeHtml,
  isNodeLike,
  isPrimitive,
  isRecord,
  kebabCase,
  renderAttrs,
} from '../src/lib/storylite/utils.js'

const reservedExports = new Set(['default', '__esModule'])
const cssRequestRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss)(?:$|\?)/

export async function emitManagerShell({ managerDistDir, outDir, manager, app }) {
  await cp(managerDistDir, outDir, { recursive: true })

  const indexPath = resolve(outDir, 'index.html')
  const template = await readFile(indexPath, 'utf8')
  await writeFile(indexPath, transformBuiltManagerHtml(template, manager, { app }))
}

export async function emitStaticStoryPages({
  appRoot,
  projectRoot,
  outDir,
  base,
  graph,
  rendererPlugins = [],
}) {
  const manifest = await graph.load({ force: true })
  const server = await createServer({
    configFile: false,
    root: projectRoot,
    appType: 'custom',
    plugins: rendererPlugins,
    server: {
      middlewareMode: true,
      hmr: false,
      ws: false,
      fs: {
        allow: [appRoot, projectRoot, resolve(projectRoot, '..'), resolve(projectRoot, '../..')],
      },
    },
    optimizeDeps: {
      entries: [],
      noDiscovery: true,
    },
  })

  try {
    const stories = await loadStaticStories(server, manifest)
    const staticRenderers = await loadStaticRenderers(server, manifest)
    const collisions = findStoryIdCollisions(stories)
    const publicAssetPaths = await resolvePublicAssetPaths(manifest.publicDir)

    if (collisions.length) {
      throw new Error(formatStoryIdCollisionError(collisions))
    }

    const css = await loadCss(server, manifest.cssFiles)
    const importedCss = await loadImportedStoryCss(server, manifest.storyFiles)

    await Promise.all(
      stories.map(async (story) => {
        const html = await renderStaticStoryPage(
          story,
          manifest,
          css,
          importedCss,
          base,
          staticRenderers,
          publicAssetPaths,
        )
        const path = resolve(outDir, storyPagePath(story.id))
        await mkdir(dirname(path), { recursive: true })
        await writeFile(path, html)
      }),
    )
  } finally {
    await server.close()
  }
}

async function loadStaticRenderers(server, manifest) {
  const entries = await Promise.all(
    manifest.rendererAdapters.map(async (adapter) => {
      if (!adapter.staticImport) {
        return [adapter.name, null]
      }

      return [adapter.name, await server.ssrLoadModule(adapter.staticImport)]
    }),
  )

  return Object.fromEntries(entries)
}

async function loadStaticStories(server, manifest) {
  const entries = await Promise.all(
    manifest.storyFiles.map(async (file) => {
      const module = await server.ssrLoadModule(fileUrl(file))
      const importPath = relative(manifest.projectRoot, file).replaceAll('\\', '/')
      return normalizeStoryModule(
        importPath,
        module,
        manifest.storyIdResolver,
        manifest.storyExportNamesByFile?.[importPath],
      )
    }),
  )

  return entries.flat()
}

export async function loadCss(server, files) {
  const contents = await Promise.all(
    files.map(async (file) => {
      const module = await server.ssrLoadModule(`${fileUrl(file)}?inline`)
      return module.default ?? ''
    }),
  )
  return contents.join('\n\n')
}

export async function loadImportedStoryCss(server, storyFiles) {
  return loadCss(server, collectImportedStoryCssFiles(server, storyFiles))
}

export function collectImportedStoryCssFiles(server, storyFiles) {
  const cssFiles = new Set()
  const seenModules = new Set()

  for (const file of storyFiles) {
    const modules = server.moduleGraph.getModulesByFile(file) ?? []

    for (const module of modules) {
      collectImportedCssFiles(module, cssFiles, seenModules)
    }
  }

  return Array.from(cssFiles)
}

function collectImportedCssFiles(module, cssFiles, seenModules) {
  if (!module || seenModules.has(module)) {
    return
  }

  seenModules.add(module)

  const cssFile = cssFileForModule(module)
  if (cssFile) {
    cssFiles.add(cssFile)
  }

  for (const importedModule of module.importedModules ?? []) {
    collectImportedCssFiles(importedModule, cssFiles, seenModules)
  }
}

function cssFileForModule(module) {
  const file = module.file ?? filePathFromModuleId(module.id)
  return file && cssRequestRE.test(file) ? file : null
}

function filePathFromModuleId(id) {
  const path = cleanModuleId(id)

  if (path.startsWith('/@fs/')) {
    return path.slice('/@fs'.length)
  }

  return null
}

function cleanModuleId(id) {
  return String(id ?? '')
    .replace(/^\0/, '')
    .split('?')[0]
}

async function renderStaticStoryPage(
  story,
  manifest,
  globalCss,
  importedCss,
  base,
  staticRenderers,
  publicAssetPaths = new Set(),
) {
  const publicAssetFallbackBase = '../../'
  const title = `${story.title} - ${story.name}`
  const storyCss = rewritePublicAssetUrls(
    collectCss(story),
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const result = await renderStaticStory(story, staticRenderers)
  const storyHtml = rewritePublicAssetUrls(
    result.html,
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const previewHeadHtml = rewritePublicAssetUrls(
    manifest.preview.headHtml ?? '',
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const previewBodyStartHtml = rewritePublicAssetUrls(
    manifest.preview.bodyStartHtml ?? '',
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const previewBodyEndHtml = rewritePublicAssetUrls(
    manifest.preview.bodyEndHtml ?? '',
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const previewGlobalCss = rewritePublicAssetUrls(
    globalCss,
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const previewImportedCss = rewritePublicAssetUrls(
    importedCss,
    publicAssetPaths,
    base,
    publicAssetFallbackBase,
  )
  const previewSetupScript = staticPreviewSetupScript(
    manifest,
    base,
    publicAssetFallbackBase,
    story,
  )
  const warning = result.warning
    ? `<p class="sl-static-warning">${escapeHtml(result.warning)}</p>`
    : ''

  return `<!doctype html>
<html lang="${escapeAttribute(manifest.preview.htmlAttrs?.lang ?? 'en')}" class="storylite-preview">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    ${previewHeadHtml}
    <style>
      ${previewBaseCss()}
      ${previewGlobalCss}
      ${previewImportedCss}
      ${storyCss}
      .sl-static-warning {
        margin: 0 0 1rem;
        padding: .75rem 1rem;
        border: 1px solid #f59e0b;
        border-radius: .5rem;
        color: #92400e;
        background: #fffbeb;
      }
    </style>
    ${previewSetupScript}
  </head>
  <body${renderAttrs(manifest.preview.bodyAttrs)}>
    ${previewBodyStartHtml}
    <main id="ss-canvas">
      ${warning}
      ${storyHtml}
    </main>
    ${previewBodyEndHtml}
    <p class="sl-static-back"><a href="${relativeUrl(base, '../../index.html')}">Back to StoryLite</a></p>
  </body>
</html>`
}

export function staticPreviewSetupScript(manifest, base, fallbackBase = '../../', story = null) {
  const shouldLoadStoryModule = story?.renderer === 'web-components'

  if (!manifest.setupFile && !shouldLoadStoryModule) {
    return ''
  }

  const projectModuleUrl = `${publicAssetBaseUrl(base, fallbackBase)}project.js`
  const importBindings = shouldLoadStoryModule ? 'setupPreview, storyModules' : 'setupPreview'
  const storyBootstrap = shouldLoadStoryModule
    ? `
      const storyModule = storyModules[${jsonForInlineScript(story.importPath)}];
      const parameters = {
        ...(storyModule?.default?.parameters ?? {}),
        ...(storyModule?.[${jsonForInlineScript(story.exportName)}]?.parameters ?? {}),
      };
      parameters.defineCustomElements?.(window);`
    : ''

  return `<script type="module">
      import { ${importBindings} } from ${jsonForInlineScript(projectModuleUrl)};
      setupPreview?.(window);
      ${storyBootstrap}
    </script>`
}

async function resolvePublicAssetPaths(publicDir) {
  if (!publicDir || !existsSync(publicDir)) {
    return new Set()
  }

  const files = await fg('**/*', {
    cwd: publicDir,
    dot: true,
    onlyFiles: true,
  })

  return new Set(files.map((file) => `/${file.replaceAll('\\', '/')}`))
}

export function rewritePublicAssetUrls(source, publicAssetPaths, base, fallbackBase) {
  if (!source || publicAssetPaths.size === 0) {
    return source
  }

  return rewriteCssAssetUrls(
    rewriteHtmlAssetUrls(source, publicAssetPaths, base, fallbackBase),
    publicAssetPaths,
    base,
    fallbackBase,
  )
}

function rewriteHtmlAssetUrls(source, publicAssetPaths, base, fallbackBase) {
  return source.replace(
    /\b(href|src|poster|srcset)\s*=\s*(["'])(.*?)\2/gi,
    (match, attribute, quote, value) => {
      if (attribute.toLowerCase() === 'srcset') {
        const rewritten = rewriteSrcset(value, publicAssetPaths, base, fallbackBase)
        return rewritten === value ? match : `${attribute}=${quote}${rewritten}${quote}`
      }

      const rewritten = rewritePublicAssetUrl(value, publicAssetPaths, base, fallbackBase)
      return rewritten === value ? match : `${attribute}=${quote}${rewritten}${quote}`
    },
  )
}

function rewriteCssAssetUrls(source, publicAssetPaths, base, fallbackBase) {
  return source.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (match, quote, value) => {
    const rewritten = rewritePublicAssetUrl(value, publicAssetPaths, base, fallbackBase)
    return rewritten === value ? match : `url(${quote}${rewritten}${quote})`
  })
}

function rewriteSrcset(value, publicAssetPaths, base, fallbackBase) {
  return value
    .split(',')
    .map((candidate) => {
      const trimmed = candidate.trim()
      const [url, ...descriptor] = trimmed.split(/\s+/)

      if (!url) {
        return candidate
      }

      const rewritten = rewritePublicAssetUrl(url, publicAssetPaths, base, fallbackBase)
      return [rewritten, ...descriptor].join(' ')
    })
    .join(', ')
}

function rewritePublicAssetUrl(value, publicAssetPaths, base, fallbackBase) {
  const asset = normalizePublicAssetReference(value)

  if (!asset || !publicAssetPaths.has(asset.path)) {
    return value
  }

  return `${publicAssetBaseUrl(base, fallbackBase)}${asset.path.slice(1)}${asset.suffix}`
}

function normalizePublicAssetReference(value) {
  if (
    !value ||
    value.startsWith('#') ||
    value.startsWith('//') ||
    /^[a-z][a-z0-9+.-]*:/i.test(value)
  ) {
    return null
  }

  const match = value.match(/^([^?#]*)([?#].*)?$/)
  const rawPath = match?.[1] ?? ''
  const suffix = match?.[2] ?? ''
  const path = rawPath.startsWith('./')
    ? `/${rawPath.slice(2)}`
    : rawPath.startsWith('/')
      ? rawPath
      : null

  return path ? { path, suffix } : null
}

function publicAssetBaseUrl(base, fallbackBase) {
  if (base === './') {
    return fallbackBase
  }

  return base.endsWith('/') ? base : `${base}/`
}

function jsonForInlineScript(value) {
  return JSON.stringify(value).replaceAll('</', '<\\/')
}

async function renderStaticStory(story, staticRenderers) {
  if (story.renderer === 'web-components' && !story.render && typeof story.component === 'string') {
    return { html: renderWebComponentStory(story) }
  }

  if (story.renderer !== 'html') {
    const renderer = resolveStaticRenderer(staticRenderers[story.renderer], story.renderer)
    return renderer(story)
  }

  if (!story.render) {
    return { html: '' }
  }

  const output = story.render(story.args, {
    id: story.id,
    title: story.title,
    name: story.name,
    canvas: null,
    document: null,
    window: null,
  })

  if (typeof output === 'string') {
    return { html: output }
  }

  if (isNodeLike(output)) {
    return {
      html: '',
      warning: 'This story returns a DOM Node or DocumentFragment, which is only rendered in dev.',
    }
  }

  return { html: output == null ? '' : String(output) }
}

function resolveStaticRenderer(module, renderer) {
  if (!module) {
    throw new Error(
      `Story uses renderer "${renderer}", but that renderer did not register a static renderer.`,
    )
  }

  if (typeof module.renderStory === 'function') {
    return module.renderStory
  }

  if (typeof module.default === 'function') {
    return module.default
  }

  if (typeof module.default?.renderStory === 'function') {
    return module.default.renderStory
  }

  throw new Error(`Renderer adapter "${renderer}" does not export a static renderStory function.`)
}

function normalizeStoryModule(importPath, module, resolveId, exportNames = []) {
  const meta = isRecord(module.default) ? module.default : {}
  const stories = []
  const title = typeof meta.title === 'string' && meta.title.trim() ? meta.title.trim() : 'Stories'

  for (const [exportName, value] of orderedStoryModuleEntries(module, exportNames)) {
    if (reservedExports.has(exportName)) {
      continue
    }

    const storyExport = normalizeStoryExport(value)
    if (!storyExport) {
      continue
    }

    const args = { ...(meta.args ?? {}), ...(storyExport.args ?? {}) }
    const parameters = { ...(meta.parameters ?? {}), ...(storyExport.parameters ?? {}) }
    const component = storyExport.component ?? meta.component
    const render = storyExport.render

    stories.push({
      id: storyId(importPath, exportName, resolveId),
      importPath,
      exportName,
      title,
      name: storyExport.name ?? labelFromExportName(exportName),
      component,
      args,
      parameters,
      render,
      renderer:
        parameters.renderer ??
        (typeof component === 'string' && !render ? 'web-components' : 'html'),
    })
  }

  return stories
}

function orderedStoryModuleEntries(module, exportNames = []) {
  const entries = []
  const seen = new Set()

  for (const exportName of exportNames) {
    if (seen.has(exportName) || reservedExports.has(exportName) || !(exportName in module)) {
      continue
    }

    entries.push([exportName, module[exportName]])
    seen.add(exportName)
  }

  for (const [exportName, value] of Object.entries(module)) {
    if (!seen.has(exportName)) {
      entries.push([exportName, value])
    }
  }

  return entries
}

function renderWebComponentStory(story) {
  const attrs = Object.entries(story.args)
    .filter(([, value]) => isPrimitive(value))
    .map(([name, value]) => {
      const attr = kebabCase(name)
      return value === true
        ? ` ${attr}`
        : value === false
          ? ''
          : ` ${attr}="${escapeAttribute(value)}"`
    })
    .join('')
  const label = typeof story.args.label === 'string' ? escapeHtml(story.args.label) : ''

  return `<${story.component}${attrs}>${label}</${story.component}>`
}

function previewBaseCss() {
  return `:root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
* { box-sizing: border-box; }
body { min-block-size: 100dvh; margin: 0; }
#ss-canvas { min-block-size: 100dvh; padding: 16px; }
.sl-static-back { position: fixed; inset-block-end: 1rem; inset-inline-end: 1rem; margin: 0; }
.sl-static-back a { color: inherit; }`
}

function normalizeStoryExport(value) {
  if (typeof value === 'function') {
    return { render: value }
  }

  return isRecord(value) ? value : null
}

function storyId(importPath, exportName, resolveId) {
  const suggestedId = suggestedStoryId(importPath, exportName)
  const resolvedId = resolveId?.(importPath, suggestedId) ?? suggestedId
  return String(resolvedId || suggestedId).trim() || suggestedId
}

function suggestedStoryId(importPath, exportName) {
  const pathPart = importPath
    .replace(/^\.\.\//, '')
    .replace(/^(?:\.\/)?src\//, '')
    .replace(/\.(stories|story)\.[cm]?[tj]sx?$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return `${pathPart}--${kebabCase(exportName)}`
}

function findStoryIdCollisions(stories) {
  const byId = new Map()

  for (const story of stories) {
    const group = byId.get(story.id) ?? []
    group.push(story)
    byId.set(story.id, group)
  }

  return Array.from(byId.entries())
    .filter(([, group]) => group.length > 1)
    .map(([id, group]) => ({ id, stories: group }))
}

function formatStoryIdCollisionError(collisions) {
  const details = collisions
    .map(
      (collision) =>
        `- ${collision.id}\n${collision.stories
          .map((story) => `  - ${story.importPath}:${story.exportName}`)
          .join('\n')}`,
    )
    .join('\n')

  return `StoryLite found duplicate story IDs. Change story exports or customize storyId in .storylite/config.ts.\n${details}`
}

function labelFromExportName(exportName) {
  return exportName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function collectCss(story) {
  const css = story.parameters.css
  return typeof css === 'string' ? css : (css?.join('\n\n') ?? '')
}

function relativeUrl(base, fallback) {
  return base === './' ? fallback : base
}
