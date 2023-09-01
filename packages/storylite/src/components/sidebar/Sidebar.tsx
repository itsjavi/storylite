import React, { useState } from 'react'

import { BookmarkIcon, MinusSquareIcon, PlusSquareIcon } from 'lucide-react'

import { useStoryLiteStore } from '@/app/stores/global'
import { getStoryNavigationTree, SLNavigationNode } from '@/services/csf-api/navigation'
import { Link, useRouterParams } from '@/services/router'

type SidebarProps = {
  title: React.ReactNode
}

type SidebarItemBaseProps = {
  navNode: SLNavigationNode
  currentStoryName?: string
  currentExportName?: string
}

export function Sidebar({ title, ...rest }: SidebarProps) {
  const { story, export_name } = useRouterParams()

  return (
    <div className={'storylite-sidebar'} {...rest}>
      <div className={'storylite-sidebar-body'}>
        <div className={'storylite-sidebar-titleWrapper'}>{title}</div>
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
  const stories = useStoryLiteStore(state => state.stories)
  const navTree = getStoryNavigationTree(stories)
  console.log('navTree', navTree)

  return (
    <nav className={'storylite-sidebar-nav'}>
      <ul>
        {navTree.map((node, i) => {
          return (
            <li key={i}>
              <SidebarListItem
                navNode={node}
                currentStoryName={currentStoryName}
                currentExportName={currentExportName}
              />
            </li>
          )
        })}

        {/* {Array.from<[string, StoryModulesMapValue]>(stories).map(([storyName, storyData], i) => {
          return (
            <SidebarListItem
              key={i}
              storyName={storyName}
              storyData={storyData}
              currentStoryName={currentStoryName}
              currentExportName={currentExportName}
            />
          )
        })} */}
      </ul>
    </nav>
  )
}

function SidebarListItemIcon(
  props: SidebarItemBaseProps & {
    isExpanded?: boolean
  },
): JSX.Element {
  const { navNode, currentStoryName, isExpanded } = props
  const canBeExpanded = navNode.children.length > 1
  const fallbackShowMenu = navNode.storyId === currentStoryName // TODO rework this
  const canBeCollapsed = canBeExpanded && (isExpanded !== undefined ? isExpanded : fallbackShowMenu)

  // TODO refactor into separated component
  const collapseIcon = navNode.iconExpanded ?? navNode.icon ?? <MinusSquareIcon />
  const expandIcon = navNode.icon ?? <PlusSquareIcon />
  const expandCollapseIcon = canBeCollapsed ? collapseIcon : expandIcon
  const defaultIcon = navNode.icon ?? <BookmarkIcon />

  return canBeExpanded ? <>{expandCollapseIcon}</> : <>{defaultIcon}</>
}

function SidebarListItem(props: SidebarItemBaseProps): JSX.Element {
  const { navNode, currentStoryName } = props
  const [isExpanded, setIsExpanded] = useState<undefined | boolean>(undefined)
  const canBeExpanded = navNode.children.length > 1

  const fallbackShowMenu = navNode.storyId === currentStoryName // TODO rework this
  const canBeCollapsed = canBeExpanded && (isExpanded !== undefined ? isExpanded : fallbackShowMenu)

  const icon = <SidebarListItemIcon {...props} isExpanded={isExpanded} />

  if (navNode.children.length === 0) {
    const classes = [navNode.storyId === currentStoryName ? 'storylite-active' : ''].join(' ')

    return (
      <li className={classes} title={navNode.title}>
        <Link to={navNode.href} className={'storylite-btn'}>
          <i className={'storylite-icon'}>{icon}</i>
          <span className={'storylite-text'}>{navNode.title}</span>
        </Link>
      </li>
    )
  }

  return (
    <li className={'storylite-with-nested'} title={navNode.title}>
      <button
        type="button"
        className={'storylite-btn'}
        onClick={() => setIsExpanded(!canBeCollapsed)}
      >
        <i className={'storylite-icon'}>{icon}</i>
        <span className={'storylite-text'}>{navNode.title}</span>
      </button>
      {canBeCollapsed && <SidebarNestedList {...props} />}
    </li>
  )
}

function SidebarNestedList(props: SidebarItemBaseProps): JSX.Element {
  const exports = undefined
  const { currentExportName, navNode } = props

  return (
    <ul className={'storylite-nested'}>
      {navNode.children.map((childNode, i) => {
        const classes = childNode.storyId === currentExportName ? 'storylite-active' : ''

        return (
          <li key={i} className={classes} title={childNode.title}>
            <Link to={childNode.href} className={'storylite-btn'}>
              <i className={'storylite-icon'}>{childNode.icon ?? <BookmarkIcon />}</i>
              <span className={'storylite-text'}>{childNode.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
