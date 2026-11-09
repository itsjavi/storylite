import type { MountedStory, StoryArgs, StoryContext, StoryLiteStory } from '@storylite/contracts'
import type { Component, JSX } from 'solid-js'
import { createComponent, DelegatedEvents, delegateEvents, render } from 'solid-js/web'

export function renderStory(
  story: StoryLiteStory,
  args: StoryArgs,
  context: StoryContext,
): MountedStory {
  const mountPoint = context.document.createElement('div')
  mountPoint.className = 'sl-solid-root'
  context.canvas.replaceChildren(mountPoint)

  // Compiled Solid JSX delegates events (onClick, onInput...) to the document that loaded the
  // module, which is the manager page, not the preview iframe. Register them on the story's
  // document too. Never clear them: that document may be the manager's own (canvas route) or
  // shared with a newer render, and delegateEvents is idempotent per document.
  delegateEvents([...DelegatedEvents], context.document)

  const dispose = render(() => resolveOutput(story, args, context), mountPoint)

  return {
    cleanup: () => {
      dispose()
      context.canvas.replaceChildren()
    },
  }
}

function resolveOutput(story: StoryLiteStory, args: StoryArgs, context: StoryContext): JSX.Element {
  if (story.render) {
    return story.render(args, context) as JSX.Element
  }

  if (typeof story.component !== 'function') {
    throw new Error(`Solid story "${story.name}" must provide a component or render function.`)
  }

  return createComponent(story.component as Component<Record<string, unknown>>, args)
}
