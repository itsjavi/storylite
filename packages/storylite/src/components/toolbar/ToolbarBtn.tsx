import { HTMLAttributes } from 'react'

type AddonToolbarBtnProps = {
  isActive?: boolean
  href?: string
  target?: string
} & HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>

export default function ToolbarBtn({
  className,
  isActive,
  children,
  href,
  target,
  ...rest
}: AddonToolbarBtnProps) {
  const activeClass = isActive ? 'Active' : ''
  const userClassName = className ? className : ''

  if (href !== undefined) {
    return (
      <a
        className={`${'Btn'} ${activeClass} ${userClassName}`}
        href={href}
        target={target}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={`${'Btn'} ${activeClass} ${userClassName}`} {...rest}>
      {children}
    </button>
  )
}
