import type { StoryContext, StoryLiteStory } from '@storylite/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { renderStory } from './client'

const Button = defineComponent({
  props: {
    onClick: { type: Function, required: true },
    onKeyDown: { type: Function, required: true },
  },
  setup(props) {
    return () =>
      h('button', { onClick: () => props.onClick(), onKeydown: () => props.onKeyDown() }, 'Press')
  },
})

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
  renderer: 'vue',
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('renderer-vue client', () => {
  it('handles events inside an iframe document', () => {
    expectEventsAfterRemount(createIframeContext())
  })

  it('handles events in the host document', () => {
    expectEventsAfterRemount(createContext(document))
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
