import { HTMLProps } from 'react'
import { cn } from '@r1stack/core'

import { useRouterQuery } from '@/services/router'

import { Story } from '../Story'

export type CanvasIframeBodyProps = {
  storyId: string
} & HTMLProps<HTMLDivElement>

export function CanvasIframeBody(props: CanvasIframeBodyProps) {
  const { storyId, ...rest } = props

  const searchParams = useRouterQuery()
  const isStandalone = searchParams.standalone ? true : false

  return (
    <div className={cn('SandboxLayout', [isStandalone, 'StandaloneSandboxLayout'])} {...rest}>
      <Story storyId={storyId} />
    </div>
  )
}
