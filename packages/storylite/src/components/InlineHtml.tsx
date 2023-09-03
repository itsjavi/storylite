import { HTMLProps } from 'react'
import { cn } from '@r1stack/cn'

type InlineHtmlProps = {
  children: string
} & HTMLProps<HTMLSpanElement>

export function InlineHtml({ children, className, ...rest }: InlineHtmlProps): JSX.Element {
  return (
    <span
      className={cn('storylite-inlinehtml', className)}
      dangerouslySetInnerHTML={{ __html: children }}
      {...rest}
    />
  )
}
