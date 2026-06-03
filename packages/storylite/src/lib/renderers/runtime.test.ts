import { describe, expect, it } from 'vitest'
import { applyArgsToElement, collectPreviewCss, renderStoryIntoCanvas } from './runtime'

describe('applyArgsToElement', () => {
  it('assigns properties and mirrors primitive values to attributes', () => {
    const attributes = new Map<string, string>()
    const element = {
      textContent: '',
      setAttribute(name: string, value: string) {
        attributes.set(name, value)
      },
      removeAttribute(name: string) {
        attributes.delete(name)
      },
      getAttribute(name: string) {
        return attributes.get(name) ?? null
      },
      hasAttribute(name: string) {
        return attributes.has(name)
      },
    } as unknown as Element

    applyArgsToElement(element, {
      variant: 'primary',
      disabled: true,
      count: 2,
      complex: { value: true },
    })

    expect((element as unknown as { variant: string }).variant).toBe('primary')
    expect(attributes.get('variant')).toBe('primary')
    expect(attributes.has('disabled')).toBe(true)
    expect(attributes.get('count')).toBe('2')
    expect(attributes.has('complex')).toBe(false)
  })
})

describe('renderStoryIntoCanvas', () => {
  it('reports missing custom renderer adapters clearly', async () => {
    const canvas = {
      replaceChildren() {},
    } as unknown as HTMLElement

    await expect(
      renderStoryIntoCanvas(
        {
          id: 'demo--custom',
          importPath: 'src/demo.stories.ts',
          exportName: 'Custom',
          title: 'Demo',
          name: 'Custom',
          args: {},
          argTypes: {},
          parameters: { renderer: 'custom' },
          renderer: 'custom',
        },
        {},
        {
          id: 'demo--custom',
          title: 'Demo',
          name: 'Custom',
          canvas,
          document: globalThis.document,
          window: globalThis.window,
        },
      ),
    ).rejects.toThrow('no matching renderer adapter is registered')
  })
})

describe('collectPreviewCss', () => {
  it('orders configured, imported, and story css', () => {
    expect(
      collectPreviewCss(
        {
          globalCss: ['.global { color: red; }'],
          importedCss: ['.imported { color: green; }'],
        },
        {
          id: 'demo--custom',
          importPath: 'src/demo.stories.ts',
          exportName: 'Custom',
          title: 'Demo',
          name: 'Custom',
          args: {},
          argTypes: {},
          parameters: {
            css: '.story { color: blue; }',
          },
          renderer: 'html',
        },
      ),
    ).toBe(
      ['.global { color: red; }', '.imported { color: green; }', '.story { color: blue; }'].join(
        '\n\n',
      ),
    )
  })
})
