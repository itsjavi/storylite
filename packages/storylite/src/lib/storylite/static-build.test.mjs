import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'
import {
  collectImportedStoryCssFiles,
  emitManagerShell,
  loadImportedStoryCss,
  loadCss,
  rewritePublicAssetUrls,
  staticPreviewSetupScript,
} from '../../../bin/static-build.mjs'

describe('storylite static build', () => {
  it('copies the prebuilt manager shell and applies manager customization', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-manager-shell-'))
    const managerDistDir = join(root, 'manager')
    const outDir = join(root, 'out')

    try {
      await mkdir(join(managerDistDir, 'storylite-assets'), { recursive: true })
      await writeFile(
        join(managerDistDir, 'index.html'),
        '<html><head><title>StoryLite</title></head><body><div id="app"></div><script type="module" src="./storylite-assets/app.js"></script></body></html>',
      )
      await writeFile(join(managerDistDir, 'storylite-assets/app.js'), 'export {}')

      await emitManagerShell({
        managerDistDir,
        outDir,
        manager: {
          htmlAttrs: { lang: 'es' },
          bodyAttrs: { 'data-manager': 'custom' },
          headHtml: '<meta name="manager" content="custom">',
          bodyStartHtml: '<div data-start></div>',
          bodyEndHtml: '<div data-end></div>',
        },
      })

      const html = await readFile(join(outDir, 'index.html'), 'utf8')
      const asset = await readFile(join(outDir, 'storylite-assets/app.js'), 'utf8')

      expect(html).toContain('<html lang="es">')
      expect(html).toContain('<body data-manager="custom">')
      expect(html).toContain('<meta name="manager" content="custom">')
      expect(html).toContain('<div data-start></div>')
      expect(html).toContain('<div data-end></div>')
      expect(asset).toBe('export {}')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('injects prerendered manager app html into the built shell', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-manager-prerender-'))
    const managerDistDir = join(root, 'manager')
    const outDir = join(root, 'out')

    try {
      await mkdir(managerDistDir, { recursive: true })
      await writeFile(
        join(managerDistDir, 'index.html'),
        '<html><head><!--app-head--></head><body><div id="app"><!--app-html--></div></body></html>',
      )

      await emitManagerShell({
        managerDistDir,
        outDir,
        manager: {},
        app: {
          head: '<meta name="app-head" content="true">',
          html: '<aside aria-label="Stories"><a href="./stories/basic--button/">Button html</a></aside>',
        },
      })

      const html = await readFile(join(outDir, 'index.html'), 'utf8')

      expect(html).toContain('<meta name="app-head" content="true">')
      expect(html).toContain('<aside aria-label="Stories">')
      expect(html).toContain('href="./stories/basic--button/"')
      expect(html).not.toContain('<!--app-head-->')
      expect(html).not.toContain('<!--app-html-->')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('loads static story css through vite transforms', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-static-css-'))
    const srcDir = join(root, 'src')
    await mkdir(srcDir)

    const cssFile = join(srcDir, 'styles.css')
    await writeFile(cssFile, '.static-demo { color: __TOKEN__; }')

    const server = await createServer({
      configFile: false,
      root,
      appType: 'custom',
      plugins: [
        {
          name: 'test-static-css-transform',
          transform(code, id) {
            if (id.includes('styles.css')) {
              return code.replace('__TOKEN__', 'transformed')
            }

            return null
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
      await expect(loadCss(server, [cssFile])).resolves.toContain('color: transformed')
    } finally {
      await server.close()
      await rm(root, { force: true, recursive: true })
    }
  })

  it('loads css imported through story modules for static pages', async () => {
    const root = await mkdtemp(join(tmpdir(), 'storylite-static-imported-css-'))
    const srcDir = join(root, 'src')
    await mkdir(srcDir)

    const storyFile = join(srcDir, 'button.stories.ts')
    const componentFile = join(srcDir, 'button.ts')
    const cssFile = join(srcDir, 'button.css')

    await writeFile(
      storyFile,
      `
        import { renderButton } from './button'

        export default { title: 'Demo' }
        export const Button = { render: renderButton }
      `,
    )
    await writeFile(
      componentFile,
      `
        import './button.css'

        export function renderButton() {
          return '<button class="imported-button">Save</button>'
        }
      `,
    )
    await writeFile(cssFile, '.imported-button { color: __TOKEN__; }')

    const server = await createServer({
      configFile: false,
      root,
      appType: 'custom',
      plugins: [
        {
          name: 'test-static-imported-css-transform',
          transform(code, id) {
            if (id.includes('button.css')) {
              return code.replace('__TOKEN__', 'transformed')
            }

            return null
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
      await server.ssrLoadModule(`/@fs${storyFile}`)

      await expect(realpath(cssFile)).resolves.toBe(
        collectImportedStoryCssFiles(server, [storyFile])[0],
      )
      await expect(loadImportedStoryCss(server, [storyFile])).resolves.toContain(
        'color: transformed',
      )
    } finally {
      await server.close()
      await rm(root, { force: true, recursive: true })
    }
  })

  it('rewrites public asset URLs for nested static story pages', () => {
    const publicAssets = new Set(['/favicon.ico', '/images/logo.png', '/fonts/ui.woff2'])
    const html = [
      '<link rel="icon" href="/favicon.ico">',
      '<img src="./images/logo.png?size=2x">',
      '<img srcset="/images/logo.png 1x, /missing.png 2x">',
      '<a href="/docs">Docs</a>',
      '<style>@font-face { src: url("/fonts/ui.woff2"); }</style>',
    ].join('')

    expect(rewritePublicAssetUrls(html, publicAssets, './', '../../')).toContain(
      'href="../../favicon.ico"',
    )
    expect(rewritePublicAssetUrls(html, publicAssets, './', '../../')).toContain(
      'src="../../images/logo.png?size=2x"',
    )
    expect(rewritePublicAssetUrls(html, publicAssets, './', '../../')).toContain(
      'srcset="../../images/logo.png 1x, /missing.png 2x"',
    )
    expect(rewritePublicAssetUrls(html, publicAssets, './', '../../')).toContain('href="/docs"')
    expect(rewritePublicAssetUrls(html, publicAssets, './', '../../')).toContain(
      'url("../../fonts/ui.woff2")',
    )
  })

  it('rewrites public asset URLs with configured base paths', () => {
    const publicAssets = new Set(['/favicon.ico', '/images/logo.png'])
    const html = '<link rel="icon" href="/favicon.ico"><img src="./images/logo.png">'

    expect(rewritePublicAssetUrls(html, publicAssets, '/storylite/', '../../')).toContain(
      'href="/storylite/favicon.ico"',
    )
    expect(rewritePublicAssetUrls(html, publicAssets, '/storylite/', '../../')).toContain(
      'src="/storylite/images/logo.png"',
    )
  })

  it('loads preview setup from static standalone story pages', () => {
    const manifest = { setupFile: '/project/.storylite/setup.ts' }

    expect(staticPreviewSetupScript(manifest, './', '../../', { renderer: 'html' })).toContain(
      'import { setupPreview } from "../../project.js";',
    )
    expect(
      staticPreviewSetupScript(manifest, '/storylite/', '../../', { renderer: 'html' }),
    ).toContain('import { setupPreview } from "/storylite/project.js";')
    expect(
      staticPreviewSetupScript({ setupFile: null }, './', '../../', { renderer: 'html' }),
    ).toBe('')
  })

  it('loads static web component story modules to define custom elements', () => {
    const script = staticPreviewSetupScript({ setupFile: null }, './', '../../', {
      importPath: 'src/components/web-components.stories.ts',
      exportName: 'DropdownMenu',
      renderer: 'web-components',
    })

    expect(script).toContain('import { setupPreview, storyModules } from "../../project.js";')
    expect(script).toContain('storyModules["src/components/web-components.stories.ts"]')
    expect(script).toContain('storyModule?.["DropdownMenu"]?.parameters')
    expect(script).toContain('parameters.defineCustomElements?.(window)')
  })
})
