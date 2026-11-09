import type { StoryContext, StoryLiteStory } from '@storylite/contracts'
import { act, createElement } from 'react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { renderStory } from './client'

type ButtonProps = { onClick: () => void; onKeyDown: () => void }

const story: StoryLiteStory = {
  id: 'test--button',
  importPath: './test.stories.ts',
  exportName: 'Button',
  title: 'Test',
  name: 'Button',
  render: (args) => createElement('button', args as ButtonProps, 'Press'),
  args: {},
  argTypes: {},
  parameters: {},
  renderer: 'react',
}

beforeAll(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  document.body.replaceChildren()
})

describe('renderer-react client', () => {
  it('handles events inside an iframe document', async () => {
    await expectEventsAfterRemount(createIframeContext())
  })

  it('handles events in the host document', async () => {
    await expectEventsAfterRemount(createContext(document))
  })
})

async function expectEventsAfterRemount(context: StoryContext): Promise<void> {
  for (let mount = 0; mount < 2; mount++) {
    const onClick = vi.fn()
    const onKeyDown = vi.fn()
    let mounted: ReturnType<typeof renderStory> | undefined
    await act(() => {
      mounted = renderStory(story, { onClick, onKeyDown }, context)
    })
    const button = context.canvas.querySelector('button')!

    button.click()
    button.dispatchEvent(
      new context.document.defaultView!.KeyboardEvent('keydown', { bubbles: true }),
    )

    expect(onClick).toHaveBeenCalledOnce()
    expect(onKeyDown).toHaveBeenCalledOnce()
    await act(() => mounted!.cleanup())
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
