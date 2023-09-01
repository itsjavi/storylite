import { SLDecorator, SLDecoratorContext, SLFunctionComponent, StoryWithId } from '@/types'

const defaultDecorator: SLDecorator = (Story, context) => {
  // apply args
  return <Story {...context.args} />
}

function applyDecorators(
  StoryComponent: React.FC,
  decorators: SLDecorator[],
  context: SLDecoratorContext,
) {
  return decorators.reduce(
    (DecoratedStory, decorator) =>
      function DecoratedWithDecorator() {
        return decorator(DecoratedStory as SLFunctionComponent, context)
      },
    StoryComponent,
  )
}

export function renderStory(storyComponent: SLFunctionComponent, story: StoryWithId) {
  // TODO: add support for a custom render function

  const decoratorContext: SLDecoratorContext = {
    ...story,
    args: {
      ...story.args,
      // TODO: apply args from the future Args UI panel
    },
  }

  const storyDecorators = story.decorators ?? [defaultDecorator]
  const DecoratedStory = applyDecorators(storyComponent, storyDecorators, decoratorContext)

  return <DecoratedStory />
}
