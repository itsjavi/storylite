import type { StoryContext, StoryLiteStory } from '@storylite/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderStory } from './client'

type ButtonProps = { onClick: () => void; onKeyDown: () => void }

function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} onKeyDown={props.onKeyDown}>
      Press
    </button>
  )
}

const story: StoryLiteStory = {
  id: 'test--button',
  importPath: './test.stories.tsx',
  exportName: 'Button',
  title: 'Test',
  name: 'Button',
  component: Button,
  args: {},
  argTypes: {},
  parameters: {},
  renderer: 'solid',
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('renderer-solid client', () => {
  it('handles delegated events inside an iframe document', () => {
    expectEventsAfterRemount(createIframeContext())
  })

  it('keeps delegated events working in the host document after cleanup', () => {
    expectEventsAfterRemount(createHostContext())
  })
})

function expectEventsAfterRemount(context: StoryContext): void {
  for (let mount = 0; mount < 2; mount++) {
    const onClick = vi.fn()
    const onKeyDown = vi.fn()
    const mounted = renderStory(story, { onClick, onKeyDown }, context)
    const button = context.canvas.querySelector('button')!

    button.click()
    button.dispatchEvent(
      new context.document.defaultView!.KeyboardEvent('keydown', { bubbles: true }),
    )

    expect(onClick).toHaveBeenCalledOnce()
    expect(onKeyDown).toHaveBeenCalledOnce()
    void mounted.cleanup()
  }
}

function createIframeContext(): StoryContext {
  const iframe = document.createElement('iframe')
  document.body.append(iframe)
  return createContext(iframe.contentDocument!)
}

function createHostContext(): StoryContext {
  return createContext(document)
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
