import React from 'react'
import { cn } from '@r1stack/core'

import { useStoryLiteStore } from '@/app/stores/global'
import { useRouterQuery } from '@/services/router'

function StoryWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useRouterQuery()
  const isStandalone = searchParams.standalone ? true : false

  return (
    <div className={cn('storylite-story', [isStandalone, 'storylite-story--standalone'])}>
      <div className={'storylite-story-canvas'}>
        <div className={'storylite-story-component'}>{children}</div>
      </div>
    </div>
  )
}

export function Story({ storyId }: { storyId: string }): JSX.Element {
  const stories = useStoryLiteStore(state => state.stories)
  const story = stories.get(storyId)
  if (!story) {
    return (
      <StoryWrapper>
        <h3>
          Story not found: <var>{storyId}</var>
        </h3>
      </StoryWrapper>
    )
  }

  if (!story.component) {
    return (
      <StoryWrapper>
        <h3>
          Story has no component: <var>{storyId}</var>
        </h3>
      </StoryWrapper>
    )
  }
  const Component = story.component as React.FC<any>

  return (
    <StoryWrapper>
      <Component />
    </StoryWrapper>
  )
}
