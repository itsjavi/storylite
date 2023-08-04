import React, { HTMLAttributes } from 'react'
import styles from './ToolbarBtn.module.css'

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
  const activeClass = isActive ? styles.Active : ''
  const userClassName = className ? className : ''

  if (href !== undefined) {
    return (
      <a
        className={`${styles.Btn} ${activeClass} ${userClassName}`}
        href={href}
        target={target}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={`${styles.Btn} ${activeClass} ${userClassName}`} {...rest}>
      {children}
    </button>
  )
}
