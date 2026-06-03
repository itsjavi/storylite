import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { isAbsolute, relative, resolve } from 'node:path'
import { parse } from '@babel/parser'
import fg from 'fast-glob'
import { loadConfigFromFile, parseAst, transformWithOxc } from 'vite'
import { resolveStoryliteCustomization } from './customization.mjs'
import { parseMarkdown } from './markdown.mjs'
import { isBareImportSpecifier, isRecord } from '../src/lib/storylite/utils.js'

export const virtualProjectId = 'virtual:storylite/project'
export const resolvedVirtualProjectId = `\0${virtualProjectId}`
export const virtualImportedCssId = 'virtual:storylite/imported-css'
export const resolvedVirtualImportedCssId = `\0${virtualImportedCssId}`
export const projectModulePath = '/project.js'

const defaultConfig = { stories: ['./src/**/*.stories.{ts,tsx,js,jsx}'], css: [] }
const builtinRenderers = new Set(['html', 'web-components'])
const reservedExports = new Set(['default', '__esModule'])
const cssFileRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss)$/
const conventionFileNames = [
  'manager-head.html',
  'manager-body-start.html',
  'manager-body-end.html',
  'manager.css',
  'ui.css',
  'preview-head.html',
  'preview-body.html',
  'preview-body-start.html',
  'preview-body-end.html',
]

export function createProjectGraph(root) {
  let server = null
  let cachedManifest = null

  return {
    setServer(nextServer) {
      server = nextServer
    },

    async load({ force = false } = {}) {
      if (!force && cachedManifest) {
        return cachedManifest
      }

      cachedManifest = await loadManifest(root, server)
      return cachedManifest
    },

    invalidate() {
      cachedManifest = null
    },

    isProjectFile(file) {
      return isProjectFile(root, file)
    },

    shouldFullReload(file) {
      const normalized = relative(root, file).replaceAll('\\', '/')
      return (
        normalized === '.storylite/config.ts' ||
        normalized === '.storylite/config.js' ||
        normalized === '.storylite/home.md' ||
        conventionFileNames.some((name) => normalized === `.storylite/${name}`)
      )
    },
  }
}

export async function loadManifest(root, server = null) {
  const configPath = findConfigPath(root)
  const config = await loadStoryliteProjectConfig(root, server, configPath)
  const storyFiles = await resolveStoryFiles(root, config.stories ?? defaultConfig.stories)
  const storyExportNamesByFile = await loadStoryExportNamesByFile(root, storyFiles)
  const [storySourceMetadataByFile, storyStaticMetadataByFile] = await Promise.all([
    loadStorySourceMetadataByFile(root, storyFiles),
    loadStoryStaticMetadataByFile(root, storyFiles, storyExportNamesByFile),
  ])
  const cssFiles = resolveFiles(root, config.css ?? [])
  const publicDir = resolvePublicDir(root, config.publicDir)
  const setupFile = config.setup ? resolveFile(root, config.setup) : null
  const rendererAdapters = resolveRendererAdapters(root, config.renderers ?? [])
  const storyIdResolver = typeof config.storyId === 'function' ? config.storyId : null
  const customization = await resolveStoryliteCustomization(root, config)
  const home = await loadHome(root, config.home, configPath)

  return {
    projectRoot: root,
    configPath,
    storyFiles,
    storyExportNamesByFile,
    storySourceMetadataByFile,
    storyStaticMetadataByFile,
    cssFiles,
    publicDir,
    setupFile,
    rendererAdapters,
    storyIdResolver,
    storyIdResolverSource: storyIdResolver ? storyIdResolver.toString() : null,
    home,
    ui: customization.projectUi,
    manager: customization.manager,
    preview: customization.preview,
  }
}

export async function loadStoryliteProjectConfig(
  root,
  server = null,
  configPath = findConfigPath(root),
) {
  return configPath ? await loadStoryliteConfig(root, configPath, server) : defaultConfig
}

export async function resolveStoryliteRendererPlugins(
  config,
  context = { target: 'manager', command: 'serve', projectRoot: process.cwd() },
) {
  const adapters = normalizeRendererAdapters(config.renderers ?? [])
  const pluginLists = await Promise.all(
    adapters.map(async (adapter) => {
      if (typeof adapter.vitePlugins !== 'function') {
        return []
      }

      const plugins = await adapter.vitePlugins(context)
      return Array.isArray(plugins) ? plugins : [plugins]
    }),
  )

  return pluginLists.flat().filter(Boolean)
}

export async function resolveStoryliteProjectPlugins(
  config,
  context = { target: 'manager', command: 'serve', projectRoot: process.cwd() },
) {
  const configured = config.vitePlugins

  if (!configured) {
    return []
  }

  const plugins = typeof configured === 'function' ? await configured(context) : configured
  return Array.isArray(plugins) ? plugins.flat().filter(Boolean) : []
}

export function generateProjectModuleCode(manifest, options = {}) {
  const useStaticStoryMetadata = options.includeStoryModules === 'metadata'
  const includeImportedCssRuntime =
    options.includeImportedCssRuntime ??
    Boolean(
      options.serveManager && options.includeStoryModules !== false && !useStaticStoryMetadata,
    )
  const importedCssRuntimeImport = includeImportedCssRuntime
    ? `import { storyliteImportedCss } from ${JSON.stringify(virtualImportedCssId)};`
    : ''
  const storyImports =
    options.includeStoryModules === false
      ? ''
      : useStaticStoryMetadata
        ? ''
        : manifest.storyFiles
            .map(
              (file, index) =>
                `import * as storyModule${index} from ${JSON.stringify(fileUrl(file))};`,
            )
            .join('\n')
  const storyMap =
    options.includeStoryModules === false
      ? ''
      : useStaticStoryMetadata
        ? formatStaticStoryModuleMap(manifest)
        : manifest.storyFiles
            .map((file, index) => {
              const importPath = relative(manifest.projectRoot, file).replaceAll('\\', '/')
              return `${JSON.stringify(importPath)}: storyModule${index}`
            })
            .join(',\n')
  const cssImports = manifest.cssFiles
    .map((file, index) => `import css${index} from ${JSON.stringify(`${fileUrl(file)}?inline`)};`)
    .join('\n')
  const cssList = manifest.cssFiles.map((_, index) => `css${index}`).join(', ')
  const setupImport =
    options.includeSetupPreview === false || !manifest.setupFile
      ? 'const importedSetupPreview = undefined;'
      : `import { setupPreview as importedSetupPreview } from ${JSON.stringify(fileUrl(manifest.setupFile))};`
  const rendererClientLoaders =
    options.includeRendererClientLoaders === false
      ? ''
      : manifest.rendererAdapters
          .map(
            (adapter) =>
              `${JSON.stringify(adapter.name)}: () => import(${JSON.stringify(adapter.clientImport)})`,
          )
          .join(',\n')
  const storyModuleExportNames = JSON.stringify(manifest.storyExportNamesByFile ?? {})
  const storySourceMetadata = JSON.stringify(manifest.storySourceMetadataByFile ?? {})
  const isStaticBuild = options.isStaticBuild ?? !options.serveManager

  return `${importedCssRuntimeImport}
${storyImports}
${cssImports}
${setupImport}

export const projectRoot = ${JSON.stringify(manifest.projectRoot)};
export const storyModules = {
${storyMap}
};
export const storyModuleExportNames = ${storyModuleExportNames};
export const storySourceMetadata = ${storySourceMetadata};
export const globalCss = [${cssList}];
export const importedCss = ${includeImportedCssRuntime ? 'storyliteImportedCss.toArray()' : '[]'};
export const setupPreview = importedSetupPreview;
export const storyIdResolver = ${formatFunctionExport(manifest.storyIdResolverSource)};
export const rendererClientLoaders = {
${rendererClientLoaders}
};
export const projectUi = ${JSON.stringify(manifest.ui)};
export const previewHtml = ${JSON.stringify(manifest.preview)};
export const managerHtml = ${JSON.stringify(manifest.manager)};
export const home = ${JSON.stringify(manifest.home)};
export const isStaticBuild = ${JSON.stringify(isStaticBuild)};
export const staticStoriesBase = ${JSON.stringify('./stories/')};`
}

function formatStaticStoryModuleMap(manifest) {
  return Object.entries(manifest.storyStaticMetadataByFile ?? {})
    .map(([importPath, metadata]) => {
      const exportNames = manifest.storyExportNamesByFile?.[importPath] ?? []
      const properties = [`default: ${JSON.stringify(metadata.default ?? {})}`]

      for (const exportName of exportNames) {
        properties.push(
          `${JSON.stringify(exportName)}: ${JSON.stringify(metadata.stories?.[exportName] ?? {})}`,
        )
      }

      return `${JSON.stringify(importPath)}: {${properties.join(',')}}`
    })
    .join(',\n')
}

export function fileUrl(file) {
  return `/@fs${file}`
}

export function storyPagePath(storyId) {
  return `stories/${storyId}/index.html`
}

export async function parseHomeMarkdown(source) {
  return parseMarkdown(source)
}

function findConfigPath(root) {
  const tsPath = resolve(root, '.storylite/config.ts')
  const jsPath = resolve(root, '.storylite/config.js')
  return existsSync(tsPath) ? tsPath : existsSync(jsPath) ? jsPath : null
}

async function loadStoryliteConfig(root, configPath, server) {
  if (server) {
    try {
      const moduleId = `${fileUrl(configPath)}?storylite-config=${Date.now()}`
      const module = await server.ssrLoadModule(moduleId)
      return module.default ?? module.config ?? defaultConfig
    } catch (error) {
      server.ssrFixStacktrace?.(error)
    }
  }

  const loaded = await loadConfigFromFile(
    { command: 'serve', mode: process.env.NODE_ENV ?? 'development' },
    configPath,
    root,
  )
  return loaded?.config ?? defaultConfig
}

function resolveRendererAdapters(root, renderers) {
  return normalizeRendererAdapters(renderers).map((adapter) => {
    const clientImport = resolveImport(root, adapter.client)

    return {
      name: adapter.name,
      clientImport: isBareImportSpecifier(adapter.client) ? adapter.client : clientImport,
      staticImport: adapter.static ? resolveImport(root, adapter.static) : null,
    }
  })
}

function normalizeRendererAdapters(renderers) {
  const seen = new Set()
  const adapters = []

  for (const adapter of renderers) {
    if (!isRecord(adapter)) {
      continue
    }

    const name = typeof adapter.name === 'string' ? adapter.name.trim() : ''
    const client = typeof adapter.client === 'string' ? adapter.client.trim() : ''
    const staticRenderer = typeof adapter.static === 'string' ? adapter.static.trim() : null

    if (!name || !client) {
      throw new Error('StoryLite renderer adapters need a non-empty name and client entry.')
    }

    if (builtinRenderers.has(name)) {
      throw new Error(`StoryLite renderer adapter "${name}" cannot override a built-in renderer.`)
    }

    if (seen.has(name)) {
      throw new Error(`StoryLite renderer adapter "${name}" is registered more than once.`)
    }

    seen.add(name)
    adapters.push({ ...adapter, name, client, static: staticRenderer })
  }

  return adapters
}

function resolveImport(root, specifier) {
  if (isAbsolute(specifier) || specifier.startsWith('.')) {
    return fileUrl(resolveFile(root, specifier))
  }

  const require = createRequire(resolve(root, 'package.json'))
  return fileUrl(require.resolve(specifier, { paths: [root] }))
}

async function resolveStoryFiles(root, patterns) {
  const matches = await fg(patterns, {
    cwd: root,
    absolute: true,
    onlyFiles: true,
  })
  return matches.sort()
}

async function loadStoryExportNamesByFile(root, storyFiles) {
  const entries = await Promise.all(
    storyFiles.map(async (file) => [
      relative(root, file).replaceAll('\\', '/'),
      await extractStoryExportNames(await readFile(file, 'utf8'), file),
    ]),
  )

  return Object.fromEntries(entries)
}

async function loadStorySourceMetadataByFile(root, storyFiles) {
  const entries = await Promise.all(
    storyFiles.map(async (file) => [
      relative(root, file).replaceAll('\\', '/'),
      extractStorySourceMetadata(await readFile(file, 'utf8'), file),
    ]),
  )

  return Object.fromEntries(entries)
}

async function loadStoryStaticMetadataByFile(root, storyFiles, exportNamesByFile) {
  const entries = await Promise.all(
    storyFiles.map(async (file) => {
      const importPath = relative(root, file).replaceAll('\\', '/')
      return [
        importPath,
        extractStoryStaticMetadata(
          await readFile(file, 'utf8'),
          file,
          exportNamesByFile[importPath] ?? [],
        ),
      ]
    }),
  )

  return Object.fromEntries(entries)
}

export async function extractStoryExportNames(source, file = 'story.stories.ts') {
  let ast

  try {
    const transformed = await transformWithOxc(source, file, {
      lang: oxcLanguageForFile(file),
    })
    ast = parseAst(transformed.code)
  } catch {
    return []
  }

  const names = []

  for (const statement of ast.body) {
    if (statement.type !== 'ExportNamedDeclaration') {
      continue
    }

    if (statement.declaration) {
      addDeclarationExportNames(names, statement.declaration)
      continue
    }

    for (const specifier of statement.specifiers ?? []) {
      addExportName(names, specifier.exported?.name)
    }
  }

  return names
}

export function extractStorySourceMetadata(source, file = 'story.stories.tsx') {
  let ast

  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: babelParserPluginsForFile(file),
      errorRecovery: true,
    })
  } catch {
    return {}
  }

  const declarations = collectTopLevelDeclarations(ast.program.body)
  const metaComponentName = extractMetaComponentName(ast.program.body, declarations)
  const storyComponentNames = {}

  for (const statement of ast.program.body) {
    if (statement.type !== 'ExportNamedDeclaration') {
      continue
    }

    if (statement.declaration) {
      collectDeclarationStoryComponentNames(
        storyComponentNames,
        statement.declaration,
        declarations,
      )
      continue
    }

    for (const specifier of statement.specifiers ?? []) {
      const exportedName = exportNameFromSpecifier(specifier)
      const localName = specifier.local?.name
      if (!exportedName || !localName) {
        continue
      }

      const componentName = extractStoryComponentName(declarations.get(localName), declarations)
      if (componentName) {
        storyComponentNames[exportedName] = componentName
      }
    }
  }

  return {
    ...(metaComponentName ? { metaComponentName } : {}),
    ...(Object.keys(storyComponentNames).length > 0 ? { storyComponentNames } : {}),
  }
}

export function extractStoryStaticMetadata(source, file = 'story.stories.tsx', exportNames = []) {
  let ast

  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: babelParserPluginsForFile(file),
      errorRecovery: true,
    })
  } catch {
    return { default: {}, stories: {} }
  }

  const declarations = collectTopLevelDeclarations(ast.program.body)
  const defaultMeta = extractDefaultStoryMeta(ast.program.body, declarations)
  const exportedStories = collectExportedStoryExpressions(ast.program.body, declarations)
  const orderedExportNames = exportNames.length ? exportNames : Array.from(exportedStories.keys())
  const stories = {}

  for (const exportName of orderedExportNames) {
    if (reservedExports.has(exportName)) {
      continue
    }

    const storyMeta = extractStoryExportStaticMeta(exportedStories.get(exportName), declarations)
    stories[exportName] = storyMeta
  }

  return {
    default: defaultMeta,
    stories,
  }
}

function resolveFiles(root, files) {
  return files.map((file) => resolveFile(root, file))
}

export function resolvePublicDir(root, publicDir = 'public') {
  if (publicDir === false) {
    return false
  }

  return resolveFile(root, typeof publicDir === 'string' && publicDir.trim() ? publicDir : 'public')
}

function resolveFile(root, file) {
  return isAbsolute(file) ? file : resolve(root, file)
}

async function loadHome(root, inlineHome, configPath = null) {
  if (typeof inlineHome === 'string') {
    return {
      path: configPath ?? resolve(root, '.storylite/config.ts'),
      ...(await parseHomeMarkdown(inlineHome, 'config-home.md')),
    }
  }

  const path = resolve(root, '.storylite/home.md')

  if (!existsSync(path)) {
    return null
  }

  return {
    path,
    ...(await parseHomeMarkdown(await readFile(path, 'utf8'), path)),
  }
}

function isProjectFile(root, file) {
  const normalized = relative(root, file).replaceAll('\\', '/')
  return (
    normalized.startsWith('.storylite/') ||
    normalized.includes('.stories.') ||
    normalized.endsWith('.md') ||
    cssFileRE.test(normalized) ||
    normalized.endsWith('.html') ||
    normalized.endsWith('.tsx') ||
    normalized.endsWith('.ts')
  )
}

function addDeclarationExportNames(names, declaration) {
  if (declaration.type === 'VariableDeclaration') {
    for (const declarator of declaration.declarations) {
      addExportName(names, declarator.id?.name)
    }
    return
  }

  addExportName(names, declaration.id?.name)
}

function addExportName(names, name) {
  if (!name || name === 'default' || names.includes(name)) {
    return
  }

  names.push(name)
}

function babelParserPluginsForFile(file) {
  const plugins = []

  if (/\.[cm]?[jt]sx$/.test(file)) {
    plugins.push('jsx')
  }

  if (/\.[cm]?tsx?$/.test(file)) {
    plugins.push('typescript')
  }

  return plugins
}

function collectTopLevelDeclarations(statements) {
  const declarations = new Map()

  for (const statement of statements) {
    collectDeclarationBindings(declarations, statement)

    if (statement.type === 'ExportNamedDeclaration' && statement.declaration) {
      collectDeclarationBindings(declarations, statement.declaration)
    }
  }

  return declarations
}

function collectDeclarationBindings(declarations, declaration) {
  if (declaration.type === 'VariableDeclaration') {
    for (const declarator of declaration.declarations) {
      if (declarator.id?.type === 'Identifier') {
        declarations.set(declarator.id.name, declarator.init)
      }
    }
    return
  }

  if (
    (declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration') &&
    declaration.id?.name
  ) {
    declarations.set(declaration.id.name, declaration)
  }
}

function extractMetaComponentName(statements, declarations) {
  for (const statement of statements) {
    if (statement.type !== 'ExportDefaultDeclaration') {
      continue
    }

    const componentName = extractObjectComponentName(
      resolveDeclarationExpression(statement.declaration, declarations),
    )
    if (componentName) {
      return componentName
    }
  }

  return null
}

function extractDefaultStoryMeta(statements, declarations) {
  for (const statement of statements) {
    if (statement.type !== 'ExportDefaultDeclaration') {
      continue
    }

    const expression = resolveDeclarationExpression(statement.declaration, declarations)
    if (expression?.type !== 'ObjectExpression') {
      return {}
    }

    return {
      ...(staticStringProperty(expression, 'title')
        ? { title: staticStringProperty(expression, 'title') }
        : {}),
      ...(extractStaticParameters(expression, declarations)
        ? { parameters: extractStaticParameters(expression, declarations) }
        : {}),
    }
  }

  return {}
}

function collectExportedStoryExpressions(statements, declarations) {
  const stories = new Map()

  for (const statement of statements) {
    if (statement.type !== 'ExportNamedDeclaration') {
      continue
    }

    if (statement.declaration?.type === 'VariableDeclaration') {
      for (const declarator of statement.declaration.declarations) {
        if (declarator.id?.type === 'Identifier') {
          stories.set(declarator.id.name, declarator.init)
        }
      }
      continue
    }

    if (statement.declaration?.type === 'FunctionDeclaration' && statement.declaration.id?.name) {
      stories.set(statement.declaration.id.name, statement.declaration)
      continue
    }

    for (const specifier of statement.specifiers ?? []) {
      const exportedName = exportNameFromSpecifier(specifier)
      const localName = specifier.local?.name

      if (exportedName && localName) {
        stories.set(exportedName, declarations.get(localName))
      }
    }
  }

  return stories
}

function extractStoryExportStaticMeta(node, declarations) {
  const expression = resolveDeclarationExpression(node, declarations)

  if (expression?.type !== 'ObjectExpression') {
    return {}
  }

  return {
    ...(staticStringProperty(expression, 'name')
      ? { name: staticStringProperty(expression, 'name') }
      : {}),
    ...(extractStaticParameters(expression, declarations)
      ? { parameters: extractStaticParameters(expression, declarations) }
      : {}),
  }
}

function extractStaticParameters(objectExpression, declarations) {
  const property = findObjectProperty(objectExpression, 'parameters')

  if (property?.type !== 'ObjectProperty') {
    return null
  }

  const value = resolveDeclarationExpression(property.value, declarations)
  if (value?.type !== 'ObjectExpression') {
    return null
  }

  const renderer = staticStringProperty(value, 'renderer')
  return renderer ? { renderer } : null
}

function staticStringProperty(objectExpression, name) {
  const property = findObjectProperty(objectExpression, name)

  if (property?.type !== 'ObjectProperty') {
    return null
  }

  const value = unwrapExpression(property.value)
  return value?.type === 'StringLiteral' ? value.value : null
}

function collectDeclarationStoryComponentNames(target, declaration, declarations) {
  if (declaration.type === 'VariableDeclaration') {
    for (const declarator of declaration.declarations) {
      const exportName = declarator.id?.type === 'Identifier' ? declarator.id.name : null
      const componentName = extractStoryComponentName(declarator.init, declarations)

      if (exportName && componentName) {
        target[exportName] = componentName
      }
    }
    return
  }

  if (declaration.type === 'FunctionDeclaration' && declaration.id?.name) {
    const componentName = extractRenderComponentName(declaration)
    if (componentName) {
      target[declaration.id.name] = componentName
    }
  }
}

function extractStoryComponentName(node, declarations, seen = new Set()) {
  const expression = resolveDeclarationExpression(node, declarations, seen)

  if (!expression) {
    return null
  }

  if (expression.type === 'ObjectExpression') {
    return extractObjectComponentName(expression) ?? extractObjectRenderComponentName(expression)
  }

  if (
    expression.type === 'ArrowFunctionExpression' ||
    expression.type === 'FunctionExpression' ||
    expression.type === 'FunctionDeclaration'
  ) {
    return extractRenderComponentName(expression)
  }

  return null
}

function resolveDeclarationExpression(node, declarations, seen = new Set()) {
  const expression = unwrapExpression(node)

  if (expression?.type !== 'Identifier') {
    return expression
  }

  if (seen.has(expression.name)) {
    return expression
  }

  const declaration = declarations.get(expression.name)
  if (!declaration) {
    return expression
  }

  seen.add(expression.name)
  return resolveDeclarationExpression(declaration, declarations, seen)
}

function extractObjectComponentName(objectExpression) {
  if (objectExpression?.type !== 'ObjectExpression') {
    return null
  }

  const property = findObjectProperty(objectExpression, 'component')
  return property?.type === 'ObjectProperty' ? componentExpressionName(property.value) : null
}

function extractObjectRenderComponentName(objectExpression) {
  if (objectExpression?.type !== 'ObjectExpression') {
    return null
  }

  const property = findObjectProperty(objectExpression, 'render')

  if (!property) {
    return null
  }

  if (property.type === 'ObjectMethod') {
    return extractRenderComponentName(property)
  }

  return property.type === 'ObjectProperty' ? extractRenderComponentName(property.value) : null
}

function findObjectProperty(objectExpression, name) {
  return objectExpression.properties.find((property) => {
    if (property.type !== 'ObjectProperty' && property.type !== 'ObjectMethod') {
      return false
    }

    return propertyKeyName(property.key) === name
  })
}

function propertyKeyName(key) {
  if (key.type === 'Identifier') {
    return key.name
  }

  if (key.type === 'StringLiteral') {
    return key.value
  }

  return null
}

function extractRenderComponentName(node) {
  const expression = unwrapExpression(node)

  if (
    !expression ||
    (expression.type !== 'ArrowFunctionExpression' &&
      expression.type !== 'FunctionExpression' &&
      expression.type !== 'FunctionDeclaration' &&
      expression.type !== 'ObjectMethod')
  ) {
    return null
  }

  if (expression.body.type === 'BlockStatement') {
    return findReturnedJsxComponentName(expression.body)
  }

  return jsxComponentNameFromExpression(expression.body)
}

function findReturnedJsxComponentName(node) {
  if (!node) {
    return null
  }

  if (node.type === 'ReturnStatement') {
    return jsxComponentNameFromExpression(node.argument)
  }

  if (node.type === 'BlockStatement' || node.type === 'Program') {
    for (const statement of node.body) {
      const componentName = findReturnedJsxComponentName(statement)
      if (componentName) {
        return componentName
      }
    }
  }

  if (node.type === 'IfStatement') {
    return (
      findReturnedJsxComponentName(node.consequent) ?? findReturnedJsxComponentName(node.alternate)
    )
  }

  return null
}

function jsxComponentNameFromExpression(node) {
  const expression = unwrapExpression(node)

  if (expression?.type !== 'JSXElement') {
    return null
  }

  return jsxElementName(expression.openingElement.name)
}

function jsxElementName(name) {
  if (name.type === 'JSXIdentifier') {
    return isComponentName(name.name) ? name.name : null
  }

  if (name.type === 'JSXMemberExpression') {
    const objectName = jsxMemberObjectName(name.object)
    const propertyName = name.property.type === 'JSXIdentifier' ? name.property.name : null
    return objectName && propertyName ? `${objectName}.${propertyName}` : null
  }

  return null
}

function jsxMemberObjectName(name) {
  if (name.type === 'JSXIdentifier') {
    return name.name
  }

  if (name.type === 'JSXMemberExpression') {
    const objectName = jsxMemberObjectName(name.object)
    const propertyName = name.property.type === 'JSXIdentifier' ? name.property.name : null
    return objectName && propertyName ? `${objectName}.${propertyName}` : null
  }

  return null
}

function componentExpressionName(node) {
  const expression = unwrapExpression(node)

  if (!expression) {
    return null
  }

  if (expression.type === 'Identifier') {
    return isComponentName(expression.name) ? expression.name : null
  }

  if (expression.type === 'MemberExpression' && !expression.computed) {
    const objectName = memberExpressionObjectName(expression.object)
    const propertyName = expression.property.type === 'Identifier' ? expression.property.name : null
    return objectName && propertyName ? `${objectName}.${propertyName}` : null
  }

  return null
}

function memberExpressionObjectName(node) {
  const expression = unwrapExpression(node)

  if (expression?.type === 'Identifier') {
    return expression.name
  }

  if (expression?.type === 'MemberExpression' && !expression.computed) {
    const objectName = memberExpressionObjectName(expression.object)
    const propertyName = expression.property.type === 'Identifier' ? expression.property.name : null
    return objectName && propertyName ? `${objectName}.${propertyName}` : null
  }

  return null
}

function unwrapExpression(node) {
  let expression = node

  while (
    expression &&
    (expression.type === 'ParenthesizedExpression' ||
      expression.type === 'TSAsExpression' ||
      expression.type === 'TSSatisfiesExpression' ||
      expression.type === 'TSTypeAssertion' ||
      expression.type === 'TSNonNullExpression')
  ) {
    expression = expression.expression
  }

  return expression
}

function exportNameFromSpecifier(specifier) {
  if (specifier.type !== 'ExportSpecifier') {
    return null
  }

  if (specifier.exported?.type === 'Identifier') {
    return specifier.exported.name
  }

  if (specifier.exported?.type === 'StringLiteral') {
    return specifier.exported.value
  }

  return null
}

function isComponentName(name) {
  return /^[A-Z]/.test(name)
}

function oxcLanguageForFile(file) {
  if (file.endsWith('.tsx')) {
    return 'tsx'
  }

  if (file.endsWith('.jsx')) {
    return 'jsx'
  }

  if (/\.[cm]?ts$/.test(file)) {
    return 'ts'
  }

  return 'js'
}

function formatFunctionExport(source) {
  if (!source) {
    return 'undefined'
  }

  const trimmed = source.trim()

  if (/^[A-Za-z_$][\w$]*\s*\(/.test(trimmed)) {
    return `(function ${trimmed})`
  }

  return `(${trimmed})`
}
