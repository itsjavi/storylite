import { SLDecorator, SLDecoratorContext, SLFunctionComponent, StoryWithId } from '@/types'

const defaultDecorator: SLDecorator<any> = (Story, context) => {
  // apply args
  return <Story {...context?.args} />
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
  const loadedData = {} // TODO: This should be a map with the result of the loaders
  // const resolvedGlobals = {}
  const resolvedParams = story.parameters ?? {}
  const resolvedArgs = {
    ...story.args,
    // TODO: apply args from the future Args UI panel
  }

  const decoratorContext: SLDecoratorContext = {
    story: {
      id: story.id,
      name: story.name,
      title: story.title,
      component: storyComponent,
    },
    args: resolvedArgs,
    // globals: resolvedGlobals,
    parameters: resolvedParams,
    loaded: loadedData,
  }

  const storyDecorators = story.decorators ?? [defaultDecorator]
  const DecoratedStory = applyDecorators(storyComponent, storyDecorators, decoratorContext)

  if (story.render) {
    const renderContext = {
      ...decoratorContext,
      story: {
        ...decoratorContext.story,
        component: DecoratedStory,
      },
    }

    return story.render(resolvedArgs, renderContext)
  }

  return <DecoratedStory />
}
