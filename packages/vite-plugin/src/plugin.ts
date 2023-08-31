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
          import { createStoryFilesMap } from '@storylite/vite-plugin'
          
          const legacyCreateStoryMap = (stories) => {
            const sortedStories = Object.entries(stories)
              // sort stories alphabetically by path
              .sort(([aName], [bName]) => aName.localeCompare(bName))
              // sort stories by priority
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
          
          const storyFiles = import.meta.glob('/${config.stories}', {eager: true})
          const storyMap = legacyCreateStoryMap(storyFiles); // legacy
          const csfStoryMap = createStoryFilesMap(storyFiles);
          
          console.log('StoryLite CSF story map', csfStoryMap)
          
          export default csfStoryMap
        `
      }

      return null // otherwise, return null to let Vite handle the import as usual
    },
  }
}

export default storylitePlugin
