import type { Plugin } from 'vite'

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

          const exportsByFile = import.meta.glob('/${config.stories}', {eager: true})
          const storiesByFile = createStoryFilesMap(exportsByFile);
          
          export default storiesByFile
        `
      }

      return null // otherwise, return null to let Vite handle the import as usual
    },
  }
}

export default storylitePlugin
