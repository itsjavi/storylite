import type { SLNode, StoryModuleMap } from '@/types'
import { isTruthy } from '@/utility'

import { getStoryLiteBasePath } from '../router/getStoryLiteBasePath'

export type SLNavigationNode = {
  title: string
  storyId: string
  href: string
  icon?: SLNode
  iconExpanded?: SLNode
  children: SLNavigationNode[]
}

type SLTopLevelNavigation = SLNavigationNode[]

export function getStoryUrl(
  storyId: string | undefined,
  options: { standalone?: boolean; target: 'top' | 'iframe' } = {
    target: 'top',
    standalone: false,
  },
): string {
  const { standalone, target } = options
  const isIframe = target === 'iframe'

  const targetBasePath = isIframe ? '/canvas.html#' : '#'
  const targetHashBasePath = isIframe ? 'preview/' : ''
  const baseStr = [getStoryLiteBasePath(), targetBasePath, targetHashBasePath]
    .join('')
    .replace(/\/\//g, '/')

  let url = storyId === undefined ? baseStr : `${baseStr}/stories/${storyId}`

  if (standalone) {
    url += `/?standalone=true`
  }

  return url.replace(/\/\//g, '/')
}

// TODO: support nested levels by splitting the title on `/`
// and creating a new navigation node for each level, similarly like StoryBook does.
export function getStoryNavigationTree(storyModuleMap: StoryModuleMap): SLTopLevelNavigation {
  const topLevelNavigation: SLTopLevelNavigation = []

  Array.from(storyModuleMap.entries()).forEach(([storiesFileId, stories]) => {
    const topNode: SLNavigationNode = {
      title: stories.default?.title || storiesFileId,
      storyId: stories.default?.id || storiesFileId,
      href: getStoryUrl(storiesFileId, { target: 'top', standalone: false }),
      icon: stories.default?.navigation?.icon,
      iconExpanded: stories.default?.navigation?.iconExpanded,
      children: [],
    }

    Object.entries(stories).forEach(([exportedName, story]) => {
      if (story.navigation?.hidden || !isTruthy(story.component)) {
        return
      }

      const childNode: SLNavigationNode = {
        title: story.title || exportedName,
        storyId: story.id,
        href: getStoryUrl(story.id, { target: 'top', standalone: false }),
        icon: story.navigation?.icon,
        iconExpanded: story.navigation?.iconExpanded,
        children: [], // TODO: support nested levels in a future implementation
      }

      topNode.children.push(childNode)
    })

    if (topNode.children.length === 1) {
      topLevelNavigation.push(topNode.children[0])

      return
    }

    if (topNode.children.length !== 0) {
      topLevelNavigation.push(topNode)
    }
  })

  return topLevelNavigation
}
