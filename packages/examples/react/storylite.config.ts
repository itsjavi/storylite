import { StoryLiteUserConfig } from '@storylite/storylite'

// TODO: move to the plugin's function arguments, instead of a separated file-based config
const storyLiteConfig: StoryLiteUserConfig = {
  title: 'StoryLite-react', // Sidebar title
  stories: 'stories/**/*.stories.tsx', // relative to the CWD
  defaultStory: '_index', // index page file prefix, e.g. index = index.stories.tsx
}

export default storyLiteConfig
