/**
 * @type {StoryLiteUserConfig}
 */
const storyLiteConfig = {
  stories: 'stories/**/*.stories.tsx',
  defaultStory: 'index',
  title: 'StoryLite',
  styles: {
    ui: [],
    sandbox: ['@pkg/core/css/variables.css', '@pkg/core/css/reset.css', '@pkg/core/css/index.css'],
  },
}

export default storyLiteConfig
