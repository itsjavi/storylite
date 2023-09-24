import type { SLComponentProps, SLFunctionComponent, SLNode } from './components'
import type { SLParametersConfig } from './parameters'

export type SLStoryContext<F extends SLFunctionComponent = SLFunctionComponent<{}>> = {
  /**
   * The basic component data.
   *
   * > 💅 This is a StoryLite-only feature.
   */
  story: BaseStory<F> & { id: string; component: F }
  args: Story<F>['args']
  // argTypes: Story<F>['argTypes']
  // globals: Story<F>['globals']
  parameters: Story<F>['parameters']
  /**
   * A map containing all data (merged), loaded asynchronously by the configured data loaders.
   */
  loaded: {
    [key: string]: any
  }
  // hooks: { ... } // StoryLite's API hooks
  // viewMode: 'story' | 'docs' //  StoryLite's current active window
}

export type SLDecoratorContext<F extends SLFunctionComponent = SLFunctionComponent<{}>> =
  SLStoryContext<F>

export type SLPlayContext<F extends SLFunctionComponent = SLFunctionComponent<{}>> =
  SLStoryContext<F> & {
    /**
     * The DOM element that contains the rendered component.
     */
    canvasElement: HTMLElement
  }

export type SLDecorator<F extends SLFunctionComponent = SLFunctionComponent<{}>> = (
  story: F,
  context?: SLDecoratorContext<F>,
) => SLNode

export interface BaseStory<F extends SLFunctionComponent = SLFunctionComponent<{}>> {
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
  component?: F
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
export interface Story<F extends SLFunctionComponent = SLFunctionComponent<{}>>
  extends BaseStory<F> {
  /**
   * Properties to pass to the component. The will show up in the UI knobs.
   */
  args?: SLComponentProps<F>
  /**
   * Controls the display of knobs for the component.
   */
  //👨🏻‍💻 TODO:    argTypes?: SLArgTypes<F>
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
  decorators?: SLDecorator<F>[]
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
  //👨🏻‍💻 TODO:    loaders?: ((context?: SLContext<F>) => Promise<SLObject> | SLObject)[]
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
  render?: (args: SLComponentProps<F>, context?: SLStoryContext<F>) => SLNode
  /**
   * Controls how the story is rendered inside the preview.
   *
   * - `root` renders the story in the same window / DOM tree as StoryLite's UI.
   * - `iframe` renders the story in an iframe, in isolation from StoryLite's UI.
   *
   * > 💅 This is a StoryLite-only feature.
   *
   * @default 'iframe'
   */
  renderFrame?: 'root' | 'iframe'
  /**
   * Function to execute after the story is rendered (e.g. running tests).
   *
   * @see https://storybook.js.org/docs/react/api/csf#play-function
   */
  //👨🏻‍💻 TODO:    play?: (context?: SLPlayContext<F>) => Promise<void> | void
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

export interface StoryWithId<F extends SLFunctionComponent = SLFunctionComponent<{}>>
  extends Story<F> {
  id: string
}

export type StoryMap = Map<string, StoryWithId>
export type StoryModuleMap = Map<
  string,
  {
    [key: string]: StoryWithId<SLFunctionComponent<any>>
  }
>
