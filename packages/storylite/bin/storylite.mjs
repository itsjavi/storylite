#!/usr/bin/env node
import { readFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { createServer, build, preview } from 'vite'
import { transformBuiltManagerHtml } from './customization.mjs'
import { storyliteImportedCssBridgePlugin } from './imported-css-bridge.mjs'
import { isBareImportSpecifier } from '../src/lib/storylite/utils.js'
import {
  createProjectGraph,
  fileUrl,
  generateProjectModuleCode,
  loadStoryliteProjectConfig,
  projectModulePath,
  resolvedVirtualProjectId,
  resolveStoryliteProjectPlugins,
  resolveStoryliteRendererPlugins,
  virtualProjectId,
} from './project-graph.mjs'
import { emitManagerShell, emitStaticStoryPages } from './static-build.mjs'

const storyliteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appRoot = storyliteDir
const managerDistDir = resolve(storyliteDir, 'dist/manager')
const managerServerEntry = resolve(storyliteDir, 'dist/manager-server/entry-server.mjs')
const projectRoot = process.cwd()
const rawArgs = process.argv.slice(2)
const command = rawArgs[0]
const knownCommands = new Set(['dev', 'build', 'preview'])
const helpRequested = rawArgs.includes('--help') || rawArgs.includes('-h')

if (!command || helpRequested) {
  printHelp()
  process.exit(0)
}

if (!knownCommands.has(command)) {
  console.error(`Unknown StoryLite command "${command}".`)
  console.error('')
  printHelp()
  process.exit(1)
}

const { values: cliOptions, tokens: cliTokens } = parseArgs({
  args: rawArgs.slice(1),
  options: {
    base: { type: 'string' },
    host: { type: 'boolean' },
    port: { type: 'string' },
  },
  strict: false,
  allowPositionals: true,
  tokens: true,
})
const port = readPortOption()
const host = readHostOption(command === 'preview')

if (command === 'dev') {
  const graph = createProjectGraph(projectRoot)
  const manifest = await graph.load()
  const vitePlugins = await loadVitePlugins(projectRoot, {
    command: 'serve',
    target: 'manager',
  })
  const server = await createServer({
    configFile: false,
    root: projectRoot,
    appType: 'custom',
    publicDir: manifest.publicDir,
    plugins: [
      ...vitePlugins,
      storyliteImportedCssBridgePlugin(),
      storylitePlugin(projectRoot, graph, {
        managerDistDir,
        serveManager: true,
      }),
    ],
    optimizeDeps: createDependencyOptimizationConfig(manifest),
    server: {
      port,
      host,
      fs: {
        allow: [appRoot, projectRoot, resolve(projectRoot, '..'), resolve(projectRoot, '../..')],
      },
    },
  })
  await server.listen()
  server.printUrls()
  server.bindCLIShortcuts({ print: true })
} else if (command === 'build') {
  const graph = createProjectGraph(projectRoot)
  const manifest = await graph.load()
  const managerPlugins = await loadVitePlugins(projectRoot, {
    command: 'build',
    target: 'manager',
  })
  const base = readBaseOption()
  const outDir = resolve(projectRoot, 'dist-storylite')
  const prerenderedApp = await prerenderManagerApp({
    appRoot,
    projectRoot,
    graph,
    rendererPlugins: managerPlugins,
    serverEntry: managerServerEntry,
  })

  await rm(outDir, { recursive: true, force: true })
  await emitManagerShell({
    managerDistDir,
    outDir,
    manager: manifest.manager,
    app: prerenderedApp,
  })
  await build({
    configFile: false,
    root: projectRoot,
    base,
    publicDir: manifest.publicDir,
    plugins: [...managerPlugins, storylitePlugin(projectRoot, graph)],
    build: {
      outDir,
      emptyOutDir: false,
      copyPublicDir: manifest.publicDir !== false,
      rolldownOptions: {
        input: projectModulePath,
        preserveEntrySignatures: 'strict',
        output: {
          entryFileNames: 'project.js',
          chunkFileNames: 'storylite-assets/[name]-[hash].js',
          assetFileNames: 'storylite-assets/[name]-[hash][extname]',
        },
      },
    },
  })

  const staticPlugins = await loadVitePlugins(projectRoot, {
    command: 'build',
    target: 'static',
  })

  await emitStaticStoryPages({
    appRoot,
    projectRoot,
    outDir,
    base,
    graph,
    rendererPlugins: staticPlugins,
  })
} else if (command === 'preview') {
  const base = readBaseOption()
  const server = await preview({
    configFile: false,
    root: projectRoot,
    base,
    build: {
      outDir: resolve(projectRoot, 'dist-storylite'),
    },
    preview: {
      port,
      host,
    },
  })
  server.printUrls()
}

function printHelp() {
  console.log(`StoryLite

Usage:
  storylite <command> [options]
  storylite --help

Commands:
  dev      Start the managed Vite development server
  build    Build static output into dist-storylite
  preview  Serve dist-storylite with Vite preview

Options:
  -h, --help       Show this help message

Dev options:
  --port <port>    Dev server port (default: 3993, or PORT)
  --host [host]    Host to listen on; omit the value to expose on all hosts

Build options:
  --base <path>    Public base path for generated URLs (default: ./, or STORYLITE_BASE)

Preview options:
  --port <port>    Preview server port (default: 3993, or PORT)
  --host [host]    Host to listen on (default: all hosts)
  --base <path>    Public base path while serving built output (default: ./, or STORYLITE_BASE)`)
}

function storylitePlugin(root, graph = createProjectGraph(root), options = {}) {
  return {
    name: 'storylite-project',
    configureServer(server) {
      graph.setServer(server)
      server.watcher.add(resolve(root, '.storylite'))

      if (options.serveManager && options.managerDistDir) {
        server.middlewares.use(async (req, res, next) => {
          try {
            await serveManagerRequest(req, res, next, graph, options.managerDistDir)
          } catch (error) {
            next(error)
          }
        })
      }
    },
    resolveId(id) {
      if (id === virtualProjectId || id === projectModulePath) {
        return resolvedVirtualProjectId
      }
      return null
    },
    async handleHotUpdate(context) {
      if (!graph.isProjectFile(context.file)) {
        return undefined
      }

      graph.invalidate()
      const module = context.server.moduleGraph.getModuleById(resolvedVirtualProjectId)

      if (module) {
        context.server.moduleGraph.invalidateModule(module, new Set(), context.timestamp, true)
      }

      context.server.ws.send({ type: 'full-reload' })
      return []
    },
    async load(id) {
      if (id !== resolvedVirtualProjectId) {
        return null
      }

      return generateProjectModuleCode(await graph.load({ force: true }), options)
    },
  }
}

async function serveManagerRequest(req, res, next, graph, managerDistDir) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next()
    return
  }

  const url = new URL(req.url ?? '/', 'http://storylite.local')

  if (url.pathname === '/' || url.pathname === '/index.html') {
    const manifest = await graph.load()
    const template = await readFile(resolve(managerDistDir, 'index.html'), 'utf8')
    const html = transformBuiltManagerHtml(template, manifest.manager, { viteClient: true })

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(req.method === 'HEAD' ? undefined : html)
    return
  }

  const filePath = resolveManagerAssetPath(managerDistDir, url.pathname)

  if (!filePath) {
    next()
    return
  }

  const content = await readFile(filePath)
  res.statusCode = 200
  res.setHeader('Content-Type', contentTypeForPath(filePath))
  res.end(req.method === 'HEAD' ? undefined : content)
}

async function prerenderManagerApp({ appRoot, projectRoot, graph, rendererPlugins, serverEntry }) {
  const server = await createServer({
    configFile: false,
    root: projectRoot,
    appType: 'custom',
    plugins: [
      ...rendererPlugins,
      storylitePlugin(projectRoot, graph, {
        includeRendererClientLoaders: false,
        includeSetupPreview: false,
        includeStoryModules: 'metadata',
      }),
    ],
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
    const module = await server.ssrLoadModule(fileUrl(serverEntry))

    if (typeof module.render !== 'function') {
      throw new Error('StoryLite manager server entry does not export a render function.')
    }

    return module.render()
  } finally {
    graph.setServer(null)
    await server.close()
  }
}

function resolveManagerAssetPath(managerDistDir, pathname) {
  if (!pathname.startsWith('/storylite-assets/') && pathname !== '/favicon.svg') {
    return null
  }

  const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, '')
  const filePath = resolve(managerDistDir, decodedPath)
  const relativePath = relative(managerDistDir, filePath)

  if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
    return null
  }

  return filePath
}

function contentTypeForPath(path) {
  switch (extname(path)) {
    case '.css':
      return 'text/css; charset=utf-8'
    case '.html':
      return 'text/html; charset=utf-8'
    case '.js':
    case '.mjs':
      return 'text/javascript; charset=utf-8'
    case '.json':
    case '.map':
      return 'application/json; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.wasm':
      return 'application/wasm'
    default:
      return 'application/octet-stream'
  }
}

function readBaseOption() {
  return cliOptions.base || process.env.STORYLITE_BASE || './'
}

function readHostOption(defaultValue = false) {
  const hostValue = readHostCliValue()

  if (hostValue === undefined) {
    return process.env.EXPOSE_HOST === '1' || process.env.EXPOSE_HOST === 'true' || defaultValue
  }

  return hostValue
}

function readPortOption() {
  const value = cliOptions.port ?? process.env.PORT ?? '3993'
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65_535) {
    throw new Error(`Invalid --port value: ${value}`)
  }

  return parsed
}

function readHostCliValue() {
  const hostTokens = cliTokens.filter((token) => token.kind === 'option' && token.name === 'host')
  const hostToken = hostTokens.at(-1)

  if (!hostToken) {
    return undefined
  }

  if (hostToken.value !== undefined) {
    return hostToken.value
  }

  const nextToken = cliTokens.find((token) => token.index === hostToken.index + 1)
  return nextToken?.kind === 'positional' ? nextToken.value : true
}

async function loadVitePlugins(root, context) {
  const config = await loadStoryliteProjectConfig(root)
  const resolvedContext = {
    projectRoot: root,
    ...context,
  }
  const projectPlugins = await resolveStoryliteProjectPlugins(config, resolvedContext)
  const rendererPlugins = await resolveStoryliteRendererPlugins(config, resolvedContext)
  return [...projectPlugins, ...rendererPlugins]
}

function createDependencyOptimizationConfig(manifest) {
  const include = collectDependencyOptimizationIncludes(manifest)

  return include.length ? { entries: [], include } : { entries: [] }
}

function collectDependencyOptimizationIncludes(manifest) {
  const specifiers = new Set()

  for (const adapter of manifest.rendererAdapters) {
    addBareImportSpecifier(specifiers, adapter.clientImport)
  }

  return Array.from(specifiers).sort()
}

function addBareImportSpecifier(specifiers, specifier) {
  if (typeof specifier === 'string' && isBareImportSpecifier(specifier)) {
    specifiers.add(specifier)
  }
}
