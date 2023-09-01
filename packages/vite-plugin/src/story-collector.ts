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
    navigation: {
      hidden: true,
      ...modules.default?.navigation,
    },
  }

  // Recreates the modules object, but as story objects, with the default export merged into each
  return Object.fromEntries(
    Object.entries(modules)
      .map(([exportName, exportedValue]: [string, any]): [string, BaseStoryWithId] => {
        let story: Partial<BaseStoryWithId> = exportedValue

        if (typeof story === 'function') {
          // Support for stories that are exporting just a component, without any metadata
          // Then, all metadata will be inferred from the default export (if available)
          story = { component: exportedValue }
        }

        if (typeof story !== 'object') {
          throw new Error(
            `Invalid story: ${exportName}. Story exported modules should exclusively be objects ` +
              `following the StoryLite's Component Story Format (SL-CSF).`,
          )
        }

        const storyIdPrefix = fileId.replace(/^[\\\/]/g, '').replace(/[\\\/]/g, '-')
        const storyId = `${storyIdPrefix}-${exportName}`.toLowerCase()

        // Title resolution: .name -> .title -> .component.displayName -> exportName
        const storyTitle =
          story.name ??
          story.title ??
          story.component?.displayName ??
          // defaultExport.title ??
          exportName

        // don't inherit navigation from default export
        const inheritedNavigation = exportName === 'default' ? defaultExport.navigation : {}

        // named exports should inherit the default export's decorators as well and apply them
        // first, then apply their own decorators.
        const mergedDecorators =
          exportName === 'default'
            ? defaultExport.decorators ?? []
            : [...(defaultExport.decorators ?? []), ...(story.decorators ?? [])]

        const fullStory: BaseStoryWithId = {
          // we also merge default export's properties,
          // which are shared across all stories unless overridden
          ...defaultExport,
          id: storyId,
          navigation: {
            ...inheritedNavigation,
          },
          ...story,
          title: camelToTitleCase(titleizeFilename(storyTitle)),
          decorators: mergedDecorators,
        }

        if (exportName !== 'default' && !('component' in fullStory)) {
          // combined with the default export, the resulting story object should have defined a component
          throw new Error(
            `Invalid story: ${exportName}. Non-default exports must define a "component" in the ` +
              `story object.`,
          )
        }

        return [exportName, fullStory]
      })
      // first sort alphabetically by title or export name
      .sort(([exportNameA, a], [exportNameB, b]) => {
        const aVal = a?.navigation?.title || a?.title || exportNameA
        const bVal = b?.navigation?.title || b?.title || exportNameB

        return aVal.localeCompare(bVal)
      })
      // then sort by navigation.order if defined
      .sort(([, a], [, b]) => {
        const aOrder = a?.navigation?.order ?? Infinity
        const bOrder = b?.navigation?.order ?? Infinity

        return aOrder - bOrder
      }),
  )
}

export function createStoryFilesMap(storyFiles: StoryFiles): StoryFilesMap {
  const storyFileMap: StoryFilesMap = new Map()

  Object.entries(storyFiles)
    // sort story files alphabetically by path
    .sort(([aPath], [bPath]) => aPath.localeCompare(bPath))
    // sort story files by the navigation.order property defined in the default export
    .sort(([, modulesA], [, modulesB]) => {
      const aOrder = modulesA?.default?.navigation?.order ?? Infinity
      const bOrder = modulesB?.default?.navigation?.order ?? Infinity

      return aOrder - bOrder
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

      storyFileMap.set(storiesFileId, fileStories)
    })

  return storyFileMap
}
