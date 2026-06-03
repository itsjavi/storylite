import { describe, expect, it } from 'vitest'
import { createImportedCssRuntimeCode, rewriteImportedCssModule } from './imported-css-bridge.mjs'

describe('storylite imported css bridge', () => {
  it('rewrites vite css style injection to the StoryLite registry', () => {
    const code = [
      'import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"',
      'const __vite__id = "/project/src/button.css"',
      'const __vite__css = ".button { color: red; }"',
      '__vite__updateStyle(__vite__id, __vite__css)',
      'import.meta.hot.accept()',
      'import.meta.hot.prune(() => __vite__removeStyle(__vite__id))',
    ].join('\n')
    const rewritten = rewriteImportedCssModule(code)

    expect(rewritten).toContain('__storylite_updateImportedCss')
    expect(rewritten).toContain(
      '__storylite_updateImportedCss(__vite__id, __vite__css, __vite__updateStyle)',
    )
    expect(rewritten).toContain(
      'import.meta.hot.prune(() => __storylite_removeImportedCss(__vite__id, __vite__removeStyle))',
    )
    expect(rewritten).not.toContain('__vite__updateStyle(__vite__id, __vite__css)')
  })

  it('preserves css module exports while redirecting the style side effect', () => {
    const code = [
      'import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"',
      'const __vite__id = "/project/src/button.module.css"',
      'const __vite__css = ".button_hash { color: red; }"',
      '__vite__updateStyle(__vite__id, __vite__css)',
      'export const button = "button_hash";',
      'export default { button };',
      'import.meta.hot.prune(() => __vite__removeStyle(__vite__id))',
    ].join('\n')
    const rewritten = rewriteImportedCssModule(code)

    expect(rewritten).toContain('export const button = "button_hash";')
    expect(rewritten).toContain('export default { button };')
    expect(rewritten).toContain(
      '__storylite_updateImportedCss(__vite__id, __vite__css, __vite__updateStyle)',
    )
  })

  it('creates a global registry with stable array output', async () => {
    delete globalThis.__STORYLITE_IMPORTED_CSS__

    const moduleUrl = `data:text/javascript,${encodeURIComponent(createImportedCssRuntimeCode())}`
    const module = await import(moduleUrl)

    module.storyliteImportedCss.set('one.css', '.one {}')
    module.storyliteImportedCss.set('two.css', '.two {}')
    module.storyliteImportedCss.delete('one.css')

    expect(module.storyliteImportedCss.toArray()).toEqual(['.two {}'])
  })
})
