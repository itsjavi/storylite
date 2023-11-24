import type { HTMLProps } from 'react'

import { useRouterQuery } from '@/services/router'

import { cn } from '@/utility'
import { Story } from '../Story'

export type CanvasIframeBodyProps = {
  storyId: string
} & HTMLProps<HTMLDivElement>

export function CanvasIframeBody(props: CanvasIframeBodyProps) {
  const { storyId, ...rest } = props

  const searchParams = useRouterQuery()
  const isStandalone = searchParams.standalone ? true : false

  return (
    <div
      className={cn('storylite-sandbox-layout', {
        'storylite-sandbox-layout--standalone': isStandalone,
      })}
      {...rest}
    >
      <Story storyId={storyId} />
    </div>
  )
}
