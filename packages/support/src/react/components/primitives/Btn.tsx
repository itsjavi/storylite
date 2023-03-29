import React, { HTMLAttributes } from 'react'

export type BtnProps = {
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top'
} & HTMLAttributes<HTMLAnchorElement & HTMLButtonElement>

export function Btn({ children, href, target, ...rest }: BtnProps) {
  if (href !== undefined) {
    return (
      <a href={href} target={target} tabIndex={0} role="button" {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button tabIndex={0} role="button" {...rest}>
      {children}
    </button>
  )
}
