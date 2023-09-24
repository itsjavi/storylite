import type { HTMLAttributes } from 'react'
import { cn } from '@r1stack/cn'

export type BtnProps = {
  isActive?: boolean
  href?: string
  target?: string
  hoverable?: boolean
} & HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>

export function Btn({ className, isActive, hoverable, children, href, target, ...rest }: BtnProps) {
  const classNames = cn(
    'storylite-btn',
    [isActive, 'storylite-btn--active'],
    [hoverable, 'storylite-btn--hoverable'],
    className,
  )

  if (href !== undefined) {
    return (
      <a tabIndex={0} role="button" className={classNames} href={href} target={target} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button tabIndex={0} className={classNames} type="button" {...rest}>
      {children}
    </button>
  )
}
