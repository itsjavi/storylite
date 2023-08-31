import { BaseStoryWithId, StoryFiles, StoryFilesMap } from './types'

function filenameToId(filename: string) {
  return (
    '/' +
    filename
      .replace(/\.[jt]sx?$/, '')
      .replace(/\.(stories|story)$/, '')
      .replace(/^\//g, '')
      .split('/')
      .slice(1) // remove the first segment, which is most probably the top-level directory name
      .join('/')
  )
}

function titleizeFilename(filename: string) {
  return filename
    .split(/[_-]/)
    .map(w => ((w[0] ?? '').toUpperCase() + (w.slice(1) ?? '')).trim())
    .join(' ')
}

function camelToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase()
  })
}

function modulesToStories(
  fileId: string,
  modules: { [key: string]: any },
): { [key: string]: BaseStoryWithId } {
  const defaultExport: BaseStoryWithId = {
    id: fileId,
    ...modules.default,
  }

  return Object.fromEntries(
    Object.entries(modules).map(([exportName, exportedValue]: [string, any]) => {
      let story: Partial<BaseStoryWithId> = exportedValue

      if (typeof story === 'function') {
        // Support for old StoryLite story format ( in versions =< v0.8.* )
        story = { component: exportedValue }
      }

      if (typeof story !== 'object') {
        throw new Error(
          `Invalid story: ${exportName}. Story exported modules should exclusively be objects ` +
            `following the StoryLite's Component Story Format (SL-CSF).`,
        )
      }

      // Title resolution: .name -> .title -> .component.displayName -> exportName
      const storyTitle = story.name ?? story.title ?? story.component?.displayName ?? exportName

      const fullStory: BaseStoryWithId = {
        // we also merge default export's properties,
        // which are shared across all stories unless overridden
        ...defaultExport,
        id: `${fileId}/${exportName}`,
        title: camelToTitleCase(titleizeFilename(storyTitle)),
        ...story,
      }

      if (exportName !== 'default' && !('component' in fullStory)) {
        // combined with the default export, the resulting story object should have defined a component
        throw new Error(
          `Invalid story: ${exportName}. Non-default exports must define a "component" in the ` +
            `story object.`,
        )
      }

      return [exportName, fullStory]
    }),
  )
}

export function createStoryFilesMap(storyFiles: StoryFiles): StoryFilesMap {
  const storyFileMap: StoryFilesMap = new Map()

  Object.entries(storyFiles)
    // sort story files alphabetically by path
    .sort(([aPath], [bPath]) => aPath.localeCompare(bPath))
    // sort story files by the sidebar.order property defined in the default export
    .sort(([, modulesA], [, modulesB]) => {
      const aOrder = modulesA?.default?.sidebar?.order || 0
      const bOrder = modulesB?.default?.sidebar?.order || 0

      return bOrder - aOrder
    })
    .forEach(entry => {
      const [filePath, modules] = entry
      const baseName = filePath //.split('/').pop() // get the base filename
      if (!baseName) {
        return
      }

      const storiesFileId = filenameToId(baseName)

      if (storyFileMap.has(storiesFileId)) {
        throw new Error(`Duplicate stories file identifier: ${storiesFileId}`)
      }

      const fileStories = modulesToStories(storiesFileId, modules)

      storyFileMap.set(storiesFileId, {
        // TODO: set(storiesFileId, fileStories) directly
        module: fileStories,
        meta: { title: '[meta.title is DEPRECATED]' },
      } as any)
    })

  return storyFileMap
}
