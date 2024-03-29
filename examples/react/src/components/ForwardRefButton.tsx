import { type ComponentPropsWithRef, forwardRef } from 'react'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'red' | 'green'
}

const ForwardRefButton = forwardRef<HTMLButtonElement, ButtonProps>(function ForwardRefButton(
  { variant = 'red', children, ...rest },
  ref,
) {
  return (
    <button ref={ref} style={{ color: variant }} type="button" {...rest}>
      {children}
    </button>
  )
})

export { ForwardRefButton }
