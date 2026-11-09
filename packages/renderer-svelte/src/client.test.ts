import type { StoryContext, StoryLiteStory } from '@storylite/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderStory } from './client'
import Button from './test-fixtures/Button.svelte'

const story: StoryLiteStory = {
  id: 'test--button',
  importPath: './test.stories.ts',
  exportName: 'Button',
  title: 'Test',
  name: 'Button',
  component: Button,
  args: {},
  argTypes: {},
  parameters: {},
  renderer: 'svelte',
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('renderer-svelte client', () => {
  it('handles delegated events inside an iframe document', async () => {
    await expectEventsAfterRemount(createIframeContext())
  })

  it('handles delegated events in the host document', async () => {
    await expectEventsAfterRemount(createContext(document))
  })
})

async function expectEventsAfterRemount(context: StoryContext): Promise<void> {
  for (let mount = 0; mount < 2; mount++) {
    const onclick = vi.fn()
    const onkeydown = vi.fn()
    const mounted = renderStory(story, { onclick, onkeydown }, context)
    const button = context.canvas.querySelector('button')!

    button.click()
    button.dispatchEvent(
      new context.document.defaultView!.KeyboardEvent('keydown', { bubbles: true }),
    )

    expect(onclick).toHaveBeenCalledOnce()
    expect(onkeydown).toHaveBeenCalledOnce()
    await mounted.cleanup()
  }
}

function createIframeContext(): StoryContext {
  const iframe = document.createElement('iframe')
  document.body.append(iframe)
  return createContext(iframe.contentDocument!)
}

function createContext(doc: Document): StoryContext {
  const canvas = doc.createElement('div')
  doc.body.append(canvas)
  return {
    id: story.id,
    title: story.title,
    name: story.name,
    canvas,
    document: doc,
    window: doc.defaultView!,
  }
}
