import { SLComponentProps, SLFunctionComponent, SLNode } from './components'
import { SLParametersConfig } from './parameters'

export type SLStoryContext<P extends SLFunctionComponent = SLFunctionComponent<{}>> = {
  /**
   * The basic component data.
   *
   * NOTE: This property is not common to other CSF implementations.
   */
  story: BaseStory<P> & { id: string; component: P }
  args: Story<P>['args']
  // argTypes: Story<P>['argTypes']
  // globals: Story<P>['globals']
  parameters: Story<P>['parameters']
  /**
   * A map containing all data (merged), loaded asynchronously by the configured data loaders.
   */
  loaded: {
    [key: string]: any
  }
  // hooks: { ... } // StoryLite's API hooks
  // viewMode: 'story' | 'docs' //  StoryLite's current active window
}

export type SLDecoratorContext<P extends SLFunctionComponent = SLFunctionComponent<{}>> =
  SLStoryContext<P>

export type SLPlayContext<P extends SLFunctionComponent = SLFunctionComponent<{}>> =
  SLStoryContext<P> & {
    /**
     * The DOM element that contains the rendered component.
     */
    canvasElement: HTMLElement
  }

export type SLDecorator<P extends SLFunctionComponent = SLFunctionComponent<{}>> = (
  story: P,
  context?: SLDecoratorContext<P>,
) => SLNode

export interface BaseStory<P extends SLFunctionComponent = SLFunctionComponent<{}>> {
  // /**
  //  * Unique id for the story.
  //  */
  // id: string
  /**
   * Title and path of the story in the navigation UI.
   * You can use "/" to organize stories into nested groups, if you provide a string.
   *
   * If not specified, defaults to the named export and the inferred path from the file name.
   */
  title?: string
  /**
   * Display name of the component in the UI.
   *
   * If not specified, the last segment of the `title` will be used as a fallback.
   */
  name?: string
  /**
   * The base component that this story is showcasing.
   *
   * This is also the component that will be used in the code examples and docs.
   *
   * To render more complex components in the canvas (e.g. with data fetching, state, etc),
   * you can use the `render` function.
   *
   */
  component?: P
}

/**
 * StoryLite Story Metadata object, *almost fully* compatible
 * with Storybook Component Story Format (CSF) version 3.
 *
 * The default export defines metadata about your component, including the component itself,
 * its title (where it will show up in the navigation UI story hierarchy), decorators,
 * and parameters.
 *
 * All exported stories will inherit the metadata defined in this default export.
 *
 * The component field is required and used by addons for automatic prop table generation
 * and display of other component metadata. The title field is optional and should be
 * unique (i.e., not re-used across files).
 *
 * StoryLite will always use the named export to determine the story ID and URL,
 * the `title` and `name` fields are optional and will be inferred from the named export
 * if not specified.
 */
export interface Story<P extends SLFunctionComponent = SLFunctionComponent<{}>>
  extends BaseStory<P> {
  /**
   * Properties to pass to the component. The will show up in the UI knobs.
   */
  args?: SLComponentProps<P>
  /**
   * Controls the display of knobs for the component.
   */
  //👨🏻‍💻 TODO:    argTypes?: SLArgTypes<P>
  /**
   * The story's static metadata, most commonly used to control StoryLite's
   * behavior of features and addons.
   */
  parameters?: SLParametersConfig
  /**
   * StoryLite-wide globals. In particular you can use the toolbars feature
   * to allow you to change these values using StoryLite's UI.
   */
  //👨🏻‍💻 TODO:    globals?: SLParametersConfig
  /**
   * Decorators to wrap the story in.
   */
  decorators?: SLDecorator<P>[]
  /**
   * Asynchronous functions which provide data for a story, through the render context.
   *
   * All loaders, defined at all levels that apply to a story, run before the story renders
   * in StoryLite's canvas.
   *
   * - They run in parallel
   * - All results are the loaded field in the story context
   * - If there are keys that overlap, the keys defined in the story's loaders take precedence.
   */
  //👨🏻‍💻 TODO:    loaders?: ((context?: SLContext<P>) => Promise<SLObject> | SLObject)[]
  /**
   * Render functions are a framework specific feature to allow you control on how the component renders.
   *
   * Define a custom render function for the story(ies). If not passed,
   * the default render function of the framework will be used.
   *
   * Render functions are useful to write complex stories that shouldn't be part of
   * the code snippets or documentation.
   *
   * @see https://storybook.js.org/docs/react/api/csf
   */
  render?: (args: SLComponentProps<P>, context?: SLStoryContext<P>) => SLNode
  /**
   * Function to execute after the story is rendered (e.g. running tests).
   *
   * @see https://storybook.js.org/docs/react/api/csf#play-function
   */
  //👨🏻‍💻 TODO:    play?: (context?: SLPlayContext<P>) => Promise<void> | void
  /**
   * SideBar options.
   *
   * This property is not inherited by the named story exports, when defined in the default export.
   */
  navigation?: {
    /**
     * Icon for the story in the SideBar.
     * The `iconExpanded` icon is only used when the story has other nested stories.
     */
    icon?: SLNode
    iconExpanded?: SLNode
    /**
     * Sorting order of the story in the SideBar.
     */
    order?: number

    /**
     * If true, the story will be hidden in the SideBar.
     * Useful for stories that are not intended to be directly accessible.
     *
     * @default false
     */
    hidden?: boolean
  }
}

export interface StoryWithId<P extends SLFunctionComponent = SLFunctionComponent<{}>>
  extends Story<P> {
  id: string
}

export type StoryMap = Map<string, StoryWithId>
export type StoryModuleMap = Map<
  string,
  {
    [key: string]: StoryWithId<SLFunctionComponent<any>>
  }
>
