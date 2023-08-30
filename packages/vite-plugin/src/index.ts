import { Plugin } from 'vite'

export type StoryLitePluginConfig = {
  stories: string
}

const storiesVirtualModuleId = '@storylite/vite-plugin:stories'
const resolvedStoriesVirtualModuleId = '\0@storylite/vite-plugin:stories'

const defaultConfig: StoryLitePluginConfig = {
  stories: 'stories/**/*.stories.tsx', // this is relative to the process.cwd()
}

const storylitePlugin = (userConfig?: StoryLitePluginConfig): Plugin => {
  const config = { ...defaultConfig, ...userConfig }

  return {
    name: 'vite-plugin-storylite',
    resolveId(id) {
      if (id === storiesVirtualModuleId) {
        return resolvedStoriesVirtualModuleId
      }

      return null // return null to let Vite handle the import as usual
    },

    async load(id) {
      if (id === resolvedStoriesVirtualModuleId) {
        // the returned code can only be JS
        return `
          const createStoryMap = (stories) => {
            const sortedStories = Object.entries(stories)
              .sort(([aName], [bName]) => aName.localeCompare(bName))
              .sort(([, { default: aStory }], [, { default: bStory }]) => {
                const aPriority = aStory?.priority || 0;
                const bPriority = bStory?.priority || 0;
                return bPriority - aPriority;
              });
          
            const storyMap = new Map(sortedStories.map(([path, module]) => {
              const baseName = path.split('/').pop().replace(/\.stories\.tsx$/, '');
              const meta = module.default || { title: baseName.split('_').join(' ') };
              return [baseName, { module, meta }];
            }));
          
            return storyMap;
          };
          
          const storyMap = createStoryMap(import.meta.glob('/${config.stories}', {eager: true}));
          
          export default storyMap
        `
      }

      return null // otherwise, return null to let Vite handle the import as usual
    },
  }
}

export default storylitePlugin
