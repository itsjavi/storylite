import type { HTMLAttributes } from 'react'

export type LinkableBtnProps = {
  isActive?: boolean
  href?: string
  target?: string
  hoverable?: boolean
  primary?: boolean
} & HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>

export function LinkableBtn({
  className,
  isActive,
  primary,
  hoverable,
  children,
  href,
  target,
  ...rest
}: LinkableBtnProps) {
  const classNames = [
    'btn',
    isActive ? 'btn-active' : '',
    hoverable ? 'btn-hoverable' : 'btn-not-hoverable',
    primary ? 'btn-primary' : 'btn-default',
    className,
  ]
    .filter(Boolean)
    .join(' ')

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
