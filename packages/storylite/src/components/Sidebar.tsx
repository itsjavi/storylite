import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Bookmark, MinusSquare, PlusSquare } from 'lucide-react'

import { useStoryLiteStories } from '@/app/context/StoriesDataContext'
import { ElementIds, StoryMeta, StoryModule, StoryModulesMapValue } from '@/types'

type SidebarProps = {
  title: React.ReactNode
}

type SidebarItemBaseProps = {
  storyName: string
  storyData: { module: StoryModule; meta: StoryMeta }
  exportName?: string
  currentStoryName?: string
  currentExportName?: string
}

export default function Sidebar({ title, ...rest }: SidebarProps) {
  const { story, export_name } = useParams()

  return (
    <div id={ElementIds.Sidebar} className={'Sidebar'} data-open="true" {...rest}>
      <div className={'Content'}>
        <div className={'Title'}>{title}</div>
        <SidebarNav currentStoryName={story} currentExportName={export_name} />
      </div>
    </div>
  )
}

function SidebarNav({
  currentStoryName,
  currentExportName,
}: {
  currentStoryName?: string
  currentExportName?: string
}): JSX.Element {
  const stories = useStoryLiteStories()

  return (
    <nav className={'SidebarNav'}>
      <ul>
        {Array.from<[string, StoryModulesMapValue]>(stories).map(([storyName, storyData], i) => {
          return (
            <SidebarListItem
              key={i}
              storyName={storyName}
              storyData={storyData}
              currentStoryName={currentStoryName}
              currentExportName={currentExportName}
            />
          )
        })}
      </ul>
    </nav>
  )
}

function SidebarListItem(props: SidebarItemBaseProps): JSX.Element {
  const { storyName, storyData, currentStoryName, currentExportName } = props
  const exports = Object.keys(storyData.module).filter(exportName => exportName !== 'default')
  const [showMenu, setShowMenu] = useState<undefined | boolean>(undefined)
  const hasMultipleExports = exports.length > 1

  const fallbackShowMenu = storyName === currentStoryName
  const shouldShowSubmenu =
    hasMultipleExports && (showMenu !== undefined ? showMenu : fallbackShowMenu)

  const collapsableIcon = shouldShowSubmenu ? <MinusSquare /> : <PlusSquare />
  const defaultIcon = hasMultipleExports ? collapsableIcon : <Bookmark />
  const icon = storyData.meta.icon ? storyData.meta.icon : defaultIcon

  if (exports.length === 1) {
    const firstStoryExport = storyData.module[exports[0]]
    const classes = [storyName === currentStoryName ? 'Active' : ''].join(' ')
    const title = firstStoryExport.storyTitle || storyData.meta.title || storyName
    const tooltip = typeof title === 'string' ? title : undefined

    return (
      <li className={classes} title={tooltip}>
        <Link to={`/stories/${storyName}/${exports[0]}`} className={'ListBtn'}>
          <i className={'Icon'}>{icon}</i>
          <span className={'Text'}>{title}</span>
        </Link>
      </li>
    )
  }

  const nestedList = (
    <SidebarNestedList
      {...props}
      exportName={storyName === currentStoryName ? currentExportName : undefined}
    />
  )
  const title = storyData.meta.title || storyName
  const tooltip = typeof title === 'string' ? title : undefined

  return (
    <li className={'WithNestedList'} title={tooltip}>
      <button type="button" className={'ListBtn'} onClick={() => setShowMenu(!shouldShowSubmenu)}>
        <i className={'Icon'}>{icon}</i>
        <span className={'Text'}>{title}</span>
      </button>
      {shouldShowSubmenu && nestedList}
    </li>
  )
}

function SidebarNestedList(props: SidebarItemBaseProps): JSX.Element {
  const { storyName, storyData, currentExportName } = props

  return (
    <ul className={'NestedList'}>
      {Object.keys(storyData.module)
        .filter(exportName => exportName !== 'default')
        .map((exportName, i) => {
          const exportFn = storyData.module[exportName]
          const classes = [exportName === currentExportName ? 'Active' : '', 'InnerList'].join(' ')
          const title = exportFn.storyTitle || exportName
          const tooltip = typeof title === 'string' ? title : undefined

          return (
            <li key={i} className={classes} title={tooltip}>
              <Link to={`/stories/${storyName}/${exportName}`} className={'ListBtn'}>
                <i className={'Icon'}>
                  <Bookmark />
                </i>
                <span className={'Text'}>{title}</span>
              </Link>
            </li>
          )
        })}
    </ul>
  )
}
