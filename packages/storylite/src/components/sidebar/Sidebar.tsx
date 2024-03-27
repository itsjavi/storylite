import React, { useState } from 'react'

import { useStoryLiteStore } from '@/app/stores/global'
import bookmarkIcon from '@/assets/lucide/svg/bookmark.svg'
import minusSquareIcon from '@/assets/lucide/svg/minus-square.svg'
import plusSquareIcon from '@/assets/lucide/svg/plus-square.svg'
import { InlineHtml } from '@/components/InlineHtml'
import { type SLNavigationNode, getStoryNavigationTree } from '@/services/csf-api/navigation'
import { Link, useRouterParams } from '@/services/router'
import { cn } from '@/utility'

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
  const storyModuleMap = useStoryLiteStore((state) => state.storyModuleMap)
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

  const collapseIcon = navNode.iconExpanded ?? navNode.icon ?? <InlineHtml>{minusSquareIcon}</InlineHtml>
  const expandIcon = navNode.icon ?? <InlineHtml>{plusSquareIcon}</InlineHtml>
  const expandCollapseIcon = canBeCollapsed ? collapseIcon : expandIcon
  const defaultIcon = navNode.icon ?? <InlineHtml>{bookmarkIcon}</InlineHtml>

  return canBeExpanded ? <>{expandCollapseIcon}</> : <>{defaultIcon}</>
}

function SidebarListItem(props: SidebarItemBaseProps): JSX.Element {
  const { navNode, currentStoryId } = props
  const [isExpanded, setIsExpanded] = useState<undefined | boolean>(undefined)
  const canBeExpanded = navNode.children.length > 1
  const hasActiveChildren = navNode.children.some((child) => child.storyId === currentStoryId)
  const canBeCollapsed = canBeExpanded && (isExpanded ?? hasActiveChildren)

  const icon = <SidebarListItemIcon navNode={navNode} canBeExpanded={canBeExpanded} canBeCollapsed={canBeCollapsed} />

  const classes = cn({
    'storylite-active': navNode.storyId === currentStoryId,
    'storylite-active-children': hasActiveChildren,
    'storylite-with-nested': navNode.children.length > 0,
  })

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
      <button type="button" className={'storylite-navbtn'} onClick={() => setIsExpanded(!canBeCollapsed)}>
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
              <i className={'storylite-icon'}>{childNode.icon ?? <InlineHtml>{bookmarkIcon}</InlineHtml>}</i>
              <span className={'storylite-text'}>{childNode.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
