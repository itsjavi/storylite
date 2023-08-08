import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Bookmark, MinusSquare, PlusSquare } from 'lucide-react'

import { ElementIds, StoryMeta, StoryModule, StoryModulesMapValue } from '@/types'

import storyMap from '../lib/storyMap'
import styles from './Sidebar.module.css'

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

const minTooltipLength = 16

export default function Sidebar({ title, ...rest }: SidebarProps) {
  const { story, export_name } = useParams()

  return (
    <div id={ElementIds.Sidebar} className={styles.Sidebar} data-open="true" {...rest}>
      <div className={styles.Content}>
        <div className={styles.Title}>{title}</div>
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
  return (
    <nav className={styles.Nav}>
      <ul>
        {Array.from<[string, StoryModulesMapValue]>(storyMap).map(([storyName, storyData], i) => {
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

  const fallbackShowMenu = storyName === currentStoryName
  const shouldShowSubmenu = showMenu !== undefined ? showMenu : fallbackShowMenu

  const icon = storyData.meta.icon ? (
    storyData.meta.icon
  ) : shouldShowSubmenu ? (
    <MinusSquare />
  ) : (
    <PlusSquare />
  )

  if (exports.length === 1) {
    const firstStoryExport = storyData.module[exports[0]]
    const classes = [storyName === currentStoryName ? styles.Active : ''].join(' ')
    const title = firstStoryExport.storyTitle || storyData.meta.title || storyName
    const tooltip = title.length >= minTooltipLength ? title : undefined

    return (
      <li className={classes} title={tooltip}>
        <Link to={`/stories/${storyName}/${exports[0]}`} className={styles.ListBtn}>
          <i className={styles.Icon}>{icon}</i>
          <span className={styles.Text}>{title}</span>
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
  const tooltip = title.length >= minTooltipLength ? title : undefined

  return (
    <li className={styles.WithNestedList} title={tooltip}>
      <button
        type="button"
        className={styles.ListBtn}
        onClick={() => setShowMenu(!shouldShowSubmenu)}
      >
        <i className={styles.Icon}>{icon}</i>
        <span className={styles.Text}>{title}</span>
      </button>
      {shouldShowSubmenu && nestedList}
    </li>
  )
}

function SidebarNestedList(props: SidebarItemBaseProps): JSX.Element {
  const { storyName, storyData, currentExportName } = props

  return (
    <ul className={styles.NestedList}>
      {Object.keys(storyData.module)
        .filter(exportName => exportName !== 'default')
        .map((exportName, i) => {
          const exportFn = storyData.module[exportName]
          const classes = [
            exportName === currentExportName ? styles.Active : '',
            styles.InnerList,
          ].join(' ')
          const title = exportFn.storyTitle || exportName
          const tooltip = title.length >= minTooltipLength ? title : undefined

          return (
            <li key={i} className={classes} title={tooltip}>
              <Link to={`/stories/${storyName}/${exportName}`} className={styles.ListBtn}>
                <i className={styles.Icon}>
                  <Bookmark />
                </i>
                <span className={styles.Text}>{title}</span>
              </Link>
            </li>
          )
        })}
    </ul>
  )
}
