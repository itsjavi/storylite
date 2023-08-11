import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useStoryliteStories } from '@/context/StoriesDataContext'
import { ElementIds, StoryComponent, StoryMeta, StoryModule } from '@/types'

import Toolbar from './Toolbar'

export function Story({ story, exportName }: { story: string; exportName?: string }): JSX.Element {
  const stories = useStoryliteStories()

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
        <section key={i} className={'Section'}>
          <Comp />
        </section>
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
  story,
  exportName,
  metadata,
  children,
}: {
  story: string
  exportName?: string
  metadata?: StoryMeta
  children?: React.ReactNode
}) {
  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')
  const showToolbar = !isStandalone
  const toolbarStyles = showToolbar ? {} : { display: 'none' }

  return (
    <div className={`${'Story'} ${isStandalone ? 'StandaloneStory' : ``}`}>
      <header className={'Header'} style={toolbarStyles}>
        <Toolbar story={story} exportName={exportName} storyMeta={metadata} />
      </header>
      <div id={ElementIds.StoryCanvas} className={'Canvas'}>
        {children === undefined && <p>Loading story...</p>}
        {children !== undefined && children}
      </div>
    </div>
  )
}
