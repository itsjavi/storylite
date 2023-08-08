import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { ElementIds, StoryComponent, StoryMeta, StoryModule } from '@/types'

import storyMap from '../lib/storyMap'
import styles from './Story.module.css'
import Toolbar from './Toolbar'

export function Story({ story, exportName }: { story: string; exportName: string }): JSX.Element {
  const notFound = (
    <StorySandbox story={story}>
      <h3>NO STORIES FOUND</h3>
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
        <section key={i} className={styles.Section}>
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
    <div className={`${styles.Story} ${isStandalone ? styles.Standalone : ``}`}>
      <header className={styles.Header} style={toolbarStyles}>
        <Toolbar story={story} storyMeta={metadata} />
      </header>
      <div id={ElementIds.StoryCanvas} className={styles.Canvas}>
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
