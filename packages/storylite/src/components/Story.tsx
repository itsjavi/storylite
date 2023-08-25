import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '@r1stack/core'

import { useStoryLiteStories } from '@/app/context/StoriesDataContext'
import { StoryComponent, StoryMeta, StoryModule } from '@/types'

export function Story({ story, exportName }: { story: string; exportName?: string }): JSX.Element {
  const stories = useStoryLiteStories()

  const notFound = (
    <StorySandbox story={story} exportName={exportName}>
      <h3>
        Story not found:{' '}
        <var>
          {story}
          {exportName ? `.${exportName}` : '.?'}
        </var>
      </h3>
    </StorySandbox>
  )
  const storyMapData = stories.get(story)

  if (!storyMapData) {
    return notFound
  }

  const defaultExportName = Object.keys(storyMapData.module).filter(key => key !== 'default')[0]
  const _exportName = exportName ?? defaultExportName

  if (!_exportName) {
    return notFound
  }

  if (_exportName.match(/^[A-Z]/) && typeof storyMapData.module[_exportName] === 'function') {
    const StorySandboxWrapper = createStorySandboxWrapper(story, _exportName, storyMapData.module)

    return <StorySandboxWrapper />
  }

  return notFound
}

function createStorySandboxWrapper(
  story: string,
  exportName: string,
  storyExport: StoryModule,
): React.FC<any> {
  if (!storyExport) {
    return function NullStory() {
      return <div>(NULL)</div>
    }
  }

  const components: [string, StoryComponent][] = []
  const metadata = storyExport.default || {}

  components.push([exportName, storyExport[exportName]])

  const StoryWrapper = () => {
    const stories = components.map(([, Comp], i) => {
      return (
        <div key={i} className={'storylite-story-section'}>
          <Comp />
        </div>
      )
    })

    return (
      <StorySandbox story={story} exportName={exportName} metadata={metadata}>
        {stories}
      </StorySandbox>
    )
  }

  return StoryWrapper
}

export function StorySandbox({
  children,
}: {
  story: string
  exportName?: string
  metadata?: StoryMeta
  children?: React.ReactNode
}) {
  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')

  return (
    <div className={cn('storylite-story', [isStandalone, 'storylite-story--standalone'])}>
      <div className={'storylite-story-canvas'}>
        {children === undefined && <p>Loading story...</p>}
        {children !== undefined && children}
      </div>
    </div>
  )
}
