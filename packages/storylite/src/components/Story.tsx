import React from 'react'
import { useSearchParams } from 'react-router-dom'

import storyMap from 'storylite-user-stories'

import { ElementIds, StoryComponent, StoryMeta, StoryModule } from '@/types'

import Toolbar from './Toolbar'

export function Story({ story, exportName }: { story: string; exportName: string }): JSX.Element {
  const notFound = (
    <StorySandbox story={story}>
      <h3>
        Story not found:{' '}
        <var>
          {story}.{exportName}
        </var>
      </h3>
    </StorySandbox>
  )
  const storyMapData = storyMap.get(story)

  if (!storyMapData) {
    return notFound
  }

  if (exportName.match(/^[A-Z]/) && typeof storyMapData.module[exportName] === 'function') {
    const StorySandboxWrapper = createStorySandboxWrapper(story, exportName, storyMapData.module)

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
  // const componentNames = getStoryComponentNames(storyExport)
  const metadata = storyExport.default || {}

  // for (const key of componentNames) {
  //   components.push([key, storyExport[key]])
  // }

  components.push([exportName, storyExport[exportName]])

  const StoryWrapper = () => {
    const stories = components.map(([, Comp], i) => {
      // const title = Comp.storyTitle || Comp.displayName || compName

      return (
        <section key={i} className={'Section'}>
          <Comp />
        </section>
      )
    })

    return (
      <StorySandbox story={story} metadata={metadata}>
        {stories}
      </StorySandbox>
    )
  }

  return StoryWrapper
}

export function StorySandbox({
  story,
  metadata,
  children,
}: {
  story: string
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
        <Toolbar story={story} storyMeta={metadata} />
      </header>
      <div id={ElementIds.StoryCanvas} className={'Canvas'}>
        {children === undefined && <p>Loading story...</p>}
        {children !== undefined && children}
      </div>
    </div>
  )
}

// function getStoryComponentNames(storyExport: any): string[] {
//   if (!storyExport) {
//     return []
//   }
//
//   const exports = Object.getOwnPropertyNames(storyExport)
//   const componentNames: string[] = []
//
//   for (const key of exports) {
//     if (key.match(/^[A-Z]/) && typeof storyExport[key] === 'function') {
//       componentNames.push(key)
//     }
//   }
//
//   return componentNames
// }
