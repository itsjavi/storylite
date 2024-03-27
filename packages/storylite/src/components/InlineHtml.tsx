import { cn } from '@/utility'
import type { HTMLProps } from 'react'

type InlineHtmlProps = {
  children: string
} & HTMLProps<HTMLSpanElement>

export function InlineHtml({ children, className, ...rest }: InlineHtmlProps): JSX.Element {
  return (
    <span className={cn('storylite-inlinehtml', className)} dangerouslySetInnerHTML={{ __html: children }} {...rest} />
  )
}
