import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'
import {
  createProjectGraph,
  extractStoryExportNames,
  extractStorySourceMetadata,
  generateProjectModuleCode,
  loadManifest,
  parseHomeMarkdown,
  resolvePublicDir,
  resolveStoryliteProjectPlugins,
  storyPagePath,
  virtualImportedCssId,
} from '../../../bin/project-graph.mjs'

describe('storylite project graph', () => {
  it('treats css preprocessor files as project files for reloads', () => {
    const graph = createProjectGraph('/project')

    expect(graph.isProjectFile('/project/src/button.css')).toBe(true)
    expect(graph.isProjectFile('/project/src/button.scss')).toBe(true)
    expect(graph.isProjectFile('/project/src/button.less')).toBe(true)
    expect(graph.isProjectFile('/project/src/button.styl')).toBe(true)
  })

  it('extracts story export names in source order', async () => {
    expect(
      await extractStoryExportNames(
        `
        export const Zebra = { render: () => '<p>Zebra</p>' }
        export function Alpha() {}
        const localStory = { render: () => '<p>Middle</p>' }
        export { localStory as Middle }
        export type StoryArgs = { label: string }
        export default { title: 'Demo' }
      `,
        'demo.stories.ts',
      ),
    ).toEqual(['Zebra', 'Alpha', 'Middle'])
  })

  it('extracts source component metadata from story component declarations', () => {
    expect(
      extractStorySourceMetadata(
        `
        import { Button } from './Button'
        import * as UI from './ui'

        export default {
          title: 'Demo',
          component: UI.Card,
        }

        export const Primary = {
          component: Button,
          args: { label: 'Save' },
        }

        const Member = {
          component: UI.Card,
        }

        export { Member }
      `,
        'demo.stories.tsx',
      ),
    ).toEqual({
      metaComponentName: 'UI.Card',
      storyComponentNames: {
        Member: 'UI.Card',
        Primary: 'Button',
      },
    })
  })

  it('extracts source component metadata from render JSX', () => {
    expect(
      extractStorySourceMetadata(
        `
        export const Card = {
          render: (args) => <CardView eyebrow={args.eyebrow} />,
        }

        export function FunctionStory(args) {
          return <UI.Card title={args.title} />
        }
      `,
        'demo.stories.tsx',
      ),
    ).toEqual({
      storyComponentNames: {
        Card: 'CardView',
        FunctionStory: 'UI.Card',
      },
    })
  })

  it('ignores unsupported dynamic source component expressions', () => {
    expect(
      extractStorySourceMetadata(
        `
        export const Dynamic = {
          component: resolveComponent(),
        }

        export const Native = {
          render: () => <button>Save</button>,
        }
      `,
        'demo.stories.tsx',
      ),
    ).toEqual({})
  })

  it('renders home markdown frontmatter and content', async () => {
    const home = await parseHomeMarkdown(`---
title: Demo Home
description: Welcome page
---

# Demo Home

Use **StoryLite** with \`home.md\`.

- First
- Second`)

    expect(home.frontmatter).toEqual({
      title: 'Demo Home',
      description: 'Welcome page',
    })
    expect(home.html).toContain('<h1>Demo Home</h1>')
    expect(home.html).toContain('<strong>StoryLite</strong>')
    expect(home.html).toContain('<code>home.md</code>')
    expect(home.html).toContain('<li>First</li>')
  })

  it('loads all css-only convention files and home.md from a project', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-project-graph-'))
    const storyliteDir = join(root, '.storylite')
    const srcDir = join(root, 'src')
    await mkdir(storyliteDir)
    await mkdir(srcDir)

    const conventionFiles = {
      'manager-head.html': '<meta name="manager-head" content="yes">',
      'manager-body-start.html': '<script>window.start = true</script>',
      'manager-body-end.html': '<script>window.end = true</script>',
      'manager.css': '.manager { color: red; }',
      'ui.css': '.ui { color: blue; }',
      'preview-head.html': '<meta name="preview-head" content="yes">',
      'preview-body.html': '<script>window.previewAlias = true</script>',
      'preview-body-start.html': '<div data-start></div>',
      'preview-body-end.html': '<div data-end></div>',
    }

    try {
      await writeFile(
        join(storyliteDir, 'config.ts'),
        `export default {
          stories: ['./src/**/*.stories.ts'],
          css: ['./src/styles.css'],
          storyId: (_path, suggestedId) => suggestedId.replace(/^components-/, ''),
        }`,
      )
      await writeFile(join(storyliteDir, 'home.md'), '# Home')
      await writeFile(join(srcDir, 'styles.css'), '.demo { color: red; }')
      await writeFile(join(srcDir, 'button.stories.ts'), 'export const Button = {}')
      await Promise.all(
        Object.entries(conventionFiles).map(([name, content]) =>
          writeFile(join(storyliteDir, name), content),
        ),
      )

      const manifest = await loadManifest(root)

      expect(manifest.storyFiles).toHaveLength(1)
      expect(manifest.storyExportNamesByFile).toEqual({ 'src/button.stories.ts': ['Button'] })
      expect(manifest.storySourceMetadataByFile).toEqual({ 'src/button.stories.ts': {} })
      expect(manifest.cssFiles).toHaveLength(1)
      expect(
        manifest.storyIdResolver('src/components/button.stories.ts', 'components-button--default'),
      ).toBe('button--default')
      expect(manifest.storyIdResolverSource).toContain('suggestedId')
      expect(manifest.home?.html).toContain('<h1>Home</h1>')
      expect(manifest.manager.headHtml).toContain('manager-head')
      expect(manifest.manager.bodyStartHtml).toContain('window.start')
      expect(manifest.manager.bodyEndHtml).toContain('window.end')
      expect(manifest.ui.css).toContain('.manager')
      expect(manifest.ui.css).toContain('.ui')
      expect(manifest.preview.headHtml).toContain('preview-head')
      expect(manifest.preview.bodyStartHtml).toContain('data-start')
      expect(manifest.preview.bodyEndHtml).toContain('previewAlias')
      expect(manifest.preview.bodyEndHtml).toContain('data-end')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('prefers inline home markdown from config over .storylite/home.md', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-inline-home-'))
    const storyliteDir = join(root, '.storylite')
    await mkdir(storyliteDir)

    try {
      await writeFile(
        join(storyliteDir, 'config.ts'),
        `export default {
          stories: [],
          home: '# Inline Home\\n\\nLoaded from **config**.',
        }`,
      )
      await writeFile(join(storyliteDir, 'home.md'), '# File Home')

      const manifest = await loadManifest(root)

      expect(manifest.home?.html).toContain('<h1>Inline Home</h1>')
      expect(manifest.home?.html).toContain('<strong>config</strong>')
      expect(manifest.home?.html).not.toContain('File Home')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('resolves project public assets from public/ by default', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-public-dir-'))
    const storyliteDir = join(root, '.storylite')
    await mkdir(storyliteDir)

    try {
      await writeFile(
        join(storyliteDir, 'config.ts'),
        `export default {
          stories: [],
        }`,
      )

      const manifest = await loadManifest(root)

      expect(manifest.publicDir).toBe(join(root, 'public'))
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('supports disabling or relocating project public assets', () => {
    expect(resolvePublicDir('/project', false)).toBe(false)
    expect(resolvePublicDir('/project', './.storylite/public')).toBe(
      join('/project', '.storylite/public'),
    )
  })

  it('generates base-path-safe static story page paths', () => {
    expect(storyPagePath('components-button--primary')).toBe(
      'stories/components-button--primary/index.html',
    )
  })

  it('resolves custom renderer adapter entries from config', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-renderer-graph-'))
    const storyliteDir = join(root, '.storylite')
    const srcDir = join(root, 'src')
    await mkdir(storyliteDir)
    await mkdir(srcDir)

    try {
      await writeFile(
        join(storyliteDir, 'config.ts'),
        `export default {
          stories: ['./src/**/*.stories.ts'],
          renderers: [
            {
              name: 'custom',
              client: './.storylite/custom-client.ts',
              static: './.storylite/custom-static.ts',
            },
          ],
        }`,
      )
      await writeFile(join(storyliteDir, 'custom-client.ts'), 'export const renderStory = () => {}')
      await writeFile(join(storyliteDir, 'custom-static.ts'), 'export const renderStory = () => {}')
      await writeFile(join(srcDir, 'custom.stories.ts'), 'export const Custom = {}')

      const manifest = await loadManifest(root)
      const moduleCode = generateProjectModuleCode(manifest)

      expect(manifest.rendererAdapters).toEqual([
        {
          name: 'custom',
          clientImport: `/@fs${join(storyliteDir, 'custom-client.ts')}`,
          staticImport: `/@fs${join(storyliteDir, 'custom-static.ts')}`,
        },
      ])
      expect(moduleCode).toContain(
        'export const storyModuleExportNames = {"src/custom.stories.ts":["Custom"]};',
      )
      expect(moduleCode).toContain(
        'export const storySourceMetadata = {"src/custom.stories.ts":{}};',
      )
      expect(moduleCode).toContain('export const isStaticBuild = true;')
      expect(generateProjectModuleCode(manifest, { serveManager: true })).toContain(
        'export const isStaticBuild = false;',
      )
      expect(moduleCode).toContain('"custom": () => import(')
      expect(moduleCode).toContain('custom-client.ts')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('generates metadata-only story modules without importing story files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-metadata-module-'))
    const storyliteDir = join(root, '.storylite')
    const srcDir = join(root, 'src')
    await mkdir(storyliteDir)
    await mkdir(srcDir)

    try {
      await writeFile(
        join(storyliteDir, 'config.ts'),
        `export default {
          stories: ['./src/**/*.stories.tsx'],
        }`,
      )
      await writeFile(
        join(srcDir, 'solid.stories.tsx'),
        `const parameters = { renderer: 'solid' }
export default {
  title: 'Solid/Components',
  parameters,
}
export const Button = {
  name: 'Primary button',
}
export const Card = {}`,
      )

      const manifest = await loadManifest(root)
      const moduleCode = generateProjectModuleCode(manifest, {
        includeRendererClientLoaders: false,
        includeSetupPreview: false,
        includeStoryModules: 'metadata',
      })

      expect(moduleCode).not.toContain('import * as storyModule')
      expect(moduleCode).toContain('"src/solid.stories.tsx": {default:')
      expect(moduleCode).toContain('"title":"Solid/Components"')
      expect(moduleCode).toContain('"parameters":{"renderer":"solid"}')
      expect(moduleCode).toContain('"Button": {"name":"Primary button"}')
      expect(moduleCode).toContain('"Card": {}')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('resolves project vite plugins from config', async () => {
    const firstPlugin = { name: 'first' }
    const secondPlugin = { name: 'second' }
    const context = { target: 'static', command: 'build', projectRoot: '/project' }

    expect(await resolveStoryliteProjectPlugins({}, context)).toEqual([])
    expect(
      await resolveStoryliteProjectPlugins(
        {
          vitePlugins: [firstPlugin, null, false, [secondPlugin]],
        },
        context,
      ),
    ).toEqual([firstPlugin, secondPlugin])

    let receivedContext = null
    const plugins = await resolveStoryliteProjectPlugins(
      {
        vitePlugins: (nextContext) => {
          receivedContext = nextContext
          return [firstPlugin]
        },
      },
      context,
    )

    expect(plugins).toEqual([firstPlugin])
    expect(receivedContext).toEqual(context)
  })

  it('imports configured css as vite-processed inline css', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-inline-css-'))
    const srcDir = join(root, 'src')
    await mkdir(srcDir)

    const cssFile = join(srcDir, 'styles.css')
    await writeFile(cssFile, '.demo { color: __TOKEN__; }')

    const manifest = {
      projectRoot: root,
      storyFiles: [],
      cssFiles: [cssFile],
      publicDir: false,
      setupFile: null,
      rendererAdapters: [],
      storyIdResolverSource: null,
      ui: {},
      preview: {},
      manager: {},
      home: null,
    }
    const moduleCode = generateProjectModuleCode(manifest)

    expect(moduleCode).toContain('?inline')
    expect(moduleCode).not.toContain('?raw')

    const virtualId = 'virtual:test-storylite-project'
    const resolvedVirtualId = `\0${virtualId}`
    const server = await createServer({
      configFile: false,
      root,
      appType: 'custom',
      plugins: [
        {
          name: 'test-css-transform',
          transform(code, id) {
            if (id.includes('styles.css')) {
              return code.replace('__TOKEN__', 'transformed')
            }

            return null
          },
        },
        {
          name: 'test-storylite-project',
          resolveId(id) {
            return id === virtualId ? resolvedVirtualId : null
          },
          load(id) {
            return id === resolvedVirtualId ? moduleCode : null
          },
        },
      ],
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      optimizeDeps: {
        entries: [],
        noDiscovery: true,
      },
    })

    try {
      const module = await server.ssrLoadModule(virtualId)
      expect(module.globalCss).toEqual(['.demo { color: transformed; }'])
    } finally {
      await server.close()
      await rm(root, { force: true, recursive: true })
    }
  })

  it('imports the css runtime before story modules in dev mode', () => {
    const manifest = {
      projectRoot: '/project',
      storyFiles: ['/project/src/button.stories.ts'],
      cssFiles: [],
      publicDir: false,
      setupFile: null,
      rendererAdapters: [],
      storyExportNamesByFile: {},
      storySourceMetadataByFile: {},
      storyIdResolverSource: null,
      ui: {},
      preview: {},
      manager: {},
      home: null,
    }
    const moduleCode = generateProjectModuleCode(manifest, { serveManager: true })
    const cssRuntimeImport = `import { storyliteImportedCss } from ${JSON.stringify(virtualImportedCssId)};`
    const storyImport = 'import * as storyModule0 from "/@fs/project/src/button.stories.ts";'

    expect(moduleCode.indexOf(cssRuntimeImport)).toBeGreaterThanOrEqual(0)
    expect(moduleCode.indexOf(cssRuntimeImport)).toBeLessThan(moduleCode.indexOf(storyImport))
    expect(moduleCode).toContain('export const importedCss = storyliteImportedCss.toArray();')
  })

  it('rejects renderer adapters that override built-in renderers', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-renderer-built-in-'))
    const storyliteDir = join(root, '.storylite')
    await mkdir(storyliteDir)

    try {
      await writeFile(
        join(storyliteDir, 'config.ts'),
        `export default {
          stories: [],
          renderers: [{ name: 'html', client: './renderer.ts' }],
        }`,
      )

      await expect(loadManifest(root)).rejects.toThrow('cannot override a built-in renderer')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })
})
