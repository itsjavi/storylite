// @ts-ignore
// eslint-ignore file
import { SLModuleMap, SLNode } from '@/types'
import { isTruthy } from '@/utility'

import { asCleanHash } from '../router/router.utils'

export type SLNavigationNode = {
  title: string
  storyId: string
  href: string
  icon?: SLNode
  iconExpanded?: SLNode
  children: SLNavigationNode[]
}

type SLTopLevelNavigation = SLNavigationNode[]

export function getStoryUrlHash(storyId: string): string {
  return `/#/stories/${asCleanHash(storyId)}`
}

// TODO: support nested levels by splitting the title on `/`
// and creating a new navigation node for each level, similarly like StoryBook does.
export function getStoryNavigationTree(storyModuleMap: SLModuleMap): SLTopLevelNavigation {
  const topLevelNavigation: SLTopLevelNavigation = []

  Array.from(storyModuleMap.entries()).forEach(([storiesFileId, stories]) => {
    const topNode: SLNavigationNode = {
      title: stories.default?.title || storiesFileId,
      storyId: stories.default?.id || storiesFileId,
      href: getStoryUrlHash(storiesFileId),
      children: [],
    }

    Object.entries(stories).forEach(([exportedName, story]) => {
      if (story.navigation?.disabled || !isTruthy(story.component)) {
        return
      }

      const childNode: SLNavigationNode = {
        title: story.title || exportedName,
        storyId: story.id,
        href: getStoryUrlHash(story.id),
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
