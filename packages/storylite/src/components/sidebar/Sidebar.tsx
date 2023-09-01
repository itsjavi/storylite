import React, { useState } from 'react'
import { cn } from '@r1stack/core'

import { BookmarkIcon, MinusSquareIcon, PlusSquareIcon } from 'lucide-react'

import { useStoryLiteStore } from '@/app/stores/global'
import { getStoryNavigationTree, SLNavigationNode } from '@/services/csf-api/navigation'
import { Link, useRouterParams } from '@/services/router'

type SidebarProps = {
  title: React.ReactNode
}

type SidebarItemBaseProps = {
  navNode: SLNavigationNode
  currentStoryId?: string
}

export function Sidebar({ title, ...rest }: SidebarProps) {
  const { storyId } = useRouterParams()

  return (
    <div className={'storylite-sidebar'} {...rest}>
      <div className={'storylite-sidebar-body'}>
        <div className={'storylite-sidebar-titleWrapper'}>{title}</div>
        <SidebarNav currentStoryId={storyId} />
      </div>
    </div>
  )
}

function SidebarNav({ currentStoryId }: { currentStoryId?: string }): JSX.Element {
  const storyModuleMap = useStoryLiteStore(state => state.storyModuleMap)
  const navTree = getStoryNavigationTree(storyModuleMap)

  return (
    <nav className={'storylite-sidebar-nav'}>
      <ul>
        {navTree.map((node, i) => {
          return <SidebarListItem key={i} navNode={node} currentStoryId={currentStoryId} />
        })}
      </ul>
    </nav>
  )
}

function SidebarListItemIcon(props: {
  navNode: SLNavigationNode
  canBeCollapsed: boolean
  canBeExpanded: boolean
}): JSX.Element {
  const { navNode, canBeCollapsed, canBeExpanded } = props

  const collapseIcon = navNode.iconExpanded ?? navNode.icon ?? <MinusSquareIcon />
  const expandIcon = navNode.icon ?? <PlusSquareIcon />
  const expandCollapseIcon = canBeCollapsed ? collapseIcon : expandIcon
  const defaultIcon = navNode.icon ?? <BookmarkIcon />

  return canBeExpanded ? <>{expandCollapseIcon}</> : <>{defaultIcon}</>
}

function SidebarListItem(props: SidebarItemBaseProps): JSX.Element {
  const { navNode, currentStoryId } = props
  const [isExpanded, setIsExpanded] = useState<undefined | boolean>(undefined)
  const canBeExpanded = navNode.children.length > 1
  const hasActiveChildren = navNode.children.some(child => child.storyId === currentStoryId)
  const canBeCollapsed = canBeExpanded && (isExpanded ?? hasActiveChildren)

  const icon = (
    <SidebarListItemIcon
      navNode={navNode}
      canBeExpanded={canBeExpanded}
      canBeCollapsed={canBeCollapsed}
    />
  )

  const classes = cn(
    [navNode.storyId === currentStoryId, 'storylite-active'],
    [hasActiveChildren, 'storylite-active-children'],
    [navNode.children.length > 0, 'storylite-with-nested'],
  )

  if (navNode.children.length === 0) {
    return (
      <li className={classes} title={navNode.title}>
        <Link to={navNode.href} className={'storylite-navbtn'}>
          <i className={'storylite-icon'}>{icon}</i>
          <span className={'storylite-text'}>{navNode.title}</span>
        </Link>
      </li>
    )
  }

  return (
    <li className={classes} title={navNode.title}>
      <button
        type="button"
        className={'storylite-navbtn'}
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
  const { currentStoryId, navNode } = props

  return (
    <ul className={'storylite-nested'}>
      {navNode.children.map((childNode, i) => {
        const classes = childNode.storyId === currentStoryId ? 'storylite-active' : ''

        return (
          <li key={i} className={classes} title={childNode.title}>
            <Link to={childNode.href} className={'storylite-navbtn'}>
              <i className={'storylite-icon'}>{childNode.icon ?? <BookmarkIcon />}</i>
              <span className={'storylite-text'}>{childNode.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
