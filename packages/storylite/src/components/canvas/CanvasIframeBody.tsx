import { HTMLProps } from 'react'
import { cn } from '@r1stack/core'

import { useSearchParamsMap } from '@/services/router/router.state'

import { Story } from '../Story'

export type CanvasIframeBodyProps = {
  story?: string
  exportName?: string
} & HTMLProps<HTMLDivElement>

export function CanvasIframeBody(props: CanvasIframeBodyProps) {
  const { story, exportName, ...rest } = props

  const searchParams = useSearchParamsMap()
  const isStandalone = searchParams.has('standalone')

  return (
    <div className={cn('SandboxLayout', [isStandalone, 'StandaloneSandboxLayout'])} {...rest}>
      <Story story={story ?? 'index'} exportName={exportName ?? 'default'} />
    </div>
  )
}
