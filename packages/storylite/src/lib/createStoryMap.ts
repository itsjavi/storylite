import { StoryImportGlob, StoryMeta, StoryModulesMap, StoryModulesMapValue } from '@/types'

// const stories: Record<string, StoryModule> = import.meta.glob('../../stories/**/*.stories.tsx', {
//   eager: true,
// })

export const createStoryMap = (stories: StoryImportGlob): StoryModulesMap => {
  const sortedStories = Object.entries(stories)
    .sort((a, b) => {
      // Sort by base file name
      const [aName] = a
      const [bName] = b

      if (aName > bName) {
        return 1
      }

      if (bName > aName) {
        return -1
      }

      return 0
    })
    .sort((a, b) => {
      // ... and then sort by Priority
      const [, aStory] = a
      const [, bStory] = b
      const aPriority: number = aStory.default?.priority || 0
      const bPriority: number = bStory.default?.priority || 0

      if (aPriority > bPriority) {
        return 1
      }

      if (bPriority > aPriority) {
        return -1
      }

      return 0
    })

  return new Map<string, StoryModulesMapValue>(
    sortedStories.map(([path, module]) => {
      const baseName = (path.split('/').pop() || '').replace(/\.stories\.tsx$/, '')
      const meta: StoryMeta = module.default || { title: baseName.split('_').join(' ') }

      return [
        baseName,
        {
          module,
          meta,
        },
      ]
    })
  )
}
