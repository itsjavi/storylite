import React, { useState } from 'react'

import { BookmarkIcon, MinusSquareIcon, PlusSquareIcon } from 'lucide-react'

import { useStoryLiteStories } from '@/app/context/StoriesDataContext'
import { Link } from '@/app/router'
import { useParams } from '@/app/router/router.state'
import { getStoryUrl } from '@/app/router/router.utils'
import { StoryMeta, StoryModule, StoryModulesMapValue } from '@/types'

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

export function Sidebar({ title, ...rest }: SidebarProps) {
  const { story, export_name } = useParams()

  return (
    <div className={'Sidebar'} {...rest}>
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

  const collapsableIcon = shouldShowSubmenu ? <MinusSquareIcon /> : <PlusSquareIcon />
  const defaultIcon = hasMultipleExports ? collapsableIcon : <BookmarkIcon />
  const icon = storyData.meta.icon ? storyData.meta.icon : defaultIcon

  if (exports.length === 1) {
    const firstStoryExport = storyData.module[exports[0]]
    const classes = [storyName === currentStoryName ? 'Active' : ''].join(' ')
    const title = firstStoryExport.storyTitle || storyData.meta.title || storyName
    const tooltip = typeof title === 'string' ? title : undefined

    return (
      <li className={classes} title={tooltip}>
        <Link
          to={getStoryUrl(storyName, exports[0], {
            target: 'top',
          })}
          className={'ListBtn'}
        >
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
              <Link
                to={getStoryUrl(storyName, exportName, {
                  target: 'top',
                })}
                className={'ListBtn'}
              >
                <i className={'Icon'}>
                  <BookmarkIcon />
                </i>
                <span className={'Text'}>{title}</span>
              </Link>
            </li>
          )
        })}
    </ul>
  )
}
