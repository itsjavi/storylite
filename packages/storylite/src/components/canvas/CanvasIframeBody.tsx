import { HTMLProps } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '@r1stack/core'

import { Story } from '../Story'

export type CanvasIframeBodyProps = {
  story?: string
  exportName?: string
} & HTMLProps<HTMLDivElement>

export function CanvasIframeBody(props: CanvasIframeBodyProps) {
  const { story, exportName, ...rest } = props

  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')

  return (
    <div className={cn('SandboxLayout', [isStandalone, 'StandaloneSandboxLayout'])} {...rest}>
      <Story story={story ?? 'index'} exportName={exportName ?? 'default'} />
    </div>
  )
}
